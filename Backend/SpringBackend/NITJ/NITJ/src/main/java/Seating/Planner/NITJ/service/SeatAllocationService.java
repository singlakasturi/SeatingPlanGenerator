package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.holder.RoomHolder;
import Seating.Planner.NITJ.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SeatAllocationService {

    @Autowired
    private RoomHolder roomHolder;

    @Autowired
    private StudentDataService studentDataService;

    @Autowired
    private BookingManager bookingManager;

    public AllocationResult generateSeatingPlan(AllocationRequest request) {

        Set<String> usedRooms = new HashSet<>();

        String allocationId = UUID.randomUUID().toString();

        // ----------------------------------------------------
        // 1️⃣ Collect subjects
        // ----------------------------------------------------
        List<SubjectPair> explicitPairs = request.getSubjectPairs();
        boolean hasExplicitPairs = explicitPairs != null && !explicitPairs.isEmpty();

        Set<String> allSubjects = new LinkedHashSet<>();

        if (hasExplicitPairs) {
            for (SubjectPair p : explicitPairs) {
                allSubjects.add(p.getSubjectA().trim().toUpperCase());
                allSubjects.add(p.getSubjectB().trim().toUpperCase());
            }
        } else {
            for (String sub : request.getSubjects()) {
                allSubjects.add(sub.trim().toUpperCase());
            }
        }


        // ----------------------------------------------------
        // 2️⃣ Load students
        // ----------------------------------------------------
        Map<String, Queue<String>> queues =
                studentDataService.getStudentData(new ArrayList<>(allSubjects));

        queues.replaceAll((k, v) -> new LinkedList<>(v));


        if (queues.values().stream().noneMatch(q -> !q.isEmpty())) {
            throw new IllegalStateException("No students to allocate");
        }

        // ----------------------------------------------------
        // 3️⃣ Prepare explicit pair rotation
        // ----------------------------------------------------
        Deque<SubjectPair> pairQueue = new ArrayDeque<>();
        if (hasExplicitPairs) {
            pairQueue.addAll(explicitPairs);
        }

        List<RoomAllocation> allocations = new ArrayList<>();

        // ----------------------------------------------------
        // 4️⃣ MAIN LOOP
        // ----------------------------------------------------
        while (queues.values().stream().anyMatch(q -> !q.isEmpty())) {

            String subA;
            String subB = null;

            if (hasExplicitPairs) {
                SubjectPair pair = pairQueue.pollFirst();
                pairQueue.addLast(pair);

                subA = pair.getSubjectA();
                subB = pair.getSubjectB();

                if (isEmpty(queues, subA) && isEmpty(queues, subB)) {
                    continue;
                }
            } else {
                List<String> activeSubjects = queues.entrySet()
                        .stream()
                        .filter(e -> !e.getValue().isEmpty())
                        .map(Map.Entry::getKey)
                        .collect(Collectors.toList());

                if (activeSubjects.isEmpty()) break;

                subA = activeSubjects.get(0);
                if (activeSubjects.size() > 1) {
                    subB = activeSubjects.get(1);
                }
            }


            // ---------------- Pick room ----------------
            Room room = getNextAvailableRoom(
                    request.getDate(),
                    request.getTime(),
                    allocationId,
                    usedRooms
            );

            if (room == null) {
                throw new IllegalStateException(
                        "Rooms exhausted while students remain"
                );
            }

            usedRooms.add(room.getRoomCode()); // 🔥 CRITICAL LINE

            room.getUsableSeats().forEach(Seat::clear);

            Map<String, Integer> perRoomCount = new HashMap<>();
            List<SeatAssignment> seatAssignments = new ArrayList<>();

            allocateRoom(room, subA, subB, queues, perRoomCount, seatAssignments);

            if (seatAssignments.isEmpty()) {
                throw new IllegalStateException(
                        "Deadlock: no seats allocated in room " + room.getRoomCode()
                );
            }

            List<String> subjectsForRoom =
                    (subB == null) ? List.of(subA) : List.of(subA, subB);

            bookingManager.addBooking(
                    allocationId,
                    room.getRoomCode(),
                    request.getDate(),
                    request.getTime(),
                    subjectsForRoom
            );

            allocations.add(new RoomAllocation(
                    room.getRoomCode(),
                    room.getType(),
                    subjectsForRoom,
                    seatAssignments
            ));
        }

        // ----------------------------------------------------
        // 5️⃣ Final validation
        // ----------------------------------------------------
        long remaining = queues.values()
                .stream()
                .mapToLong(Queue::size)
                .sum();

        if (remaining > 0) {
            throw new IllegalStateException(
                    "Unallocated students remain: " + remaining
            );
        }

        return new AllocationResult(
                request.getDate(),
                request.getTime(),
                allocations
        );
    }

    // ----------------------------------------------------
    // 🪑 Seat filling logic (30 per subject enforced)
    // ----------------------------------------------------
    private void allocateRoom(Room room,
                              String subA,
                              String subB,
                              Map<String, Queue<String>> queues,
                              Map<String, Integer> perRoomCount,
                              List<SeatAssignment> out) {

        for (Seat seat : room.getUsableSeats()) {

            String allowed = allowedSubjectForSeat(room, seat, subA, subB);
            if (allowed == null) continue;

            Queue<String> q = queues.get(allowed);
            if (q == null || q.isEmpty()) continue;

            if (perRoomCount.getOrDefault(allowed, 0) >= 30) continue;

            String roll = q.poll();
            if (roll == null) continue;

            seat.assign(roll);
            out.add(new SeatAssignment(
                    seat.getSeatId(),
                    roll,
                    allowed
            ));

            perRoomCount.put(
                    allowed,
                    perRoomCount.getOrDefault(allowed, 0) + 1
            );
        }
    }

    private String allowedSubjectForSeat(Room room,
                                         Seat seat,
                                         String subA,
                                         String subB) {

        if (subB == null) return subA;

        String placeholder = mapSeatToPlaceholder(room, seat);
        if (placeholder == null) return subA;

        return "A".equals(placeholder) ? subA : subB;
    }

    private String mapSeatToPlaceholder(Room room, Seat seat) {

        int col = seat.getColumn();
        String section = seat.getSection();

        if (room.getType() == Room.RoomType.LT) {
            if ("L".equals(section)) {
                return (col == 1 || col == 5 || col == 8) ? "A"
                        : (col == 2 || col == 7) ? "B" : null;
            } else {
                return (col == 1 || col == 5 || col == 8) ? "B"
                        : (col == 2 || col == 7) ? "A" : null;
            }
        } else {
            return col == 1 ? "A" : col == 3 ? "B" : null;
        }
    }

    // ----------------------------------------------------
    // 🧰 Helpers
    // ----------------------------------------------------
    private boolean isEmpty(Map<String, Queue<String>> queues, String subject) {
        Queue<String> q = queues.get(subject);
        return q == null || q.isEmpty();
    }

    private Room getNextAvailableRoom(String date,
                                      String time,
                                      String allocationId,
                                      Set<String> usedRooms) {

        return roomHolder.getAllRooms()
                .stream()
                .filter(r ->
                        !usedRooms.contains(r.getRoomCode()) &&   // 🔥 NEW
                                bookingManager.isRoomAvailable(
                                        r.getRoomCode(),
                                        date,
                                        time,
                                        allocationId
                                )
                )
                .findFirst()
                .orElse(null);
    }
}
