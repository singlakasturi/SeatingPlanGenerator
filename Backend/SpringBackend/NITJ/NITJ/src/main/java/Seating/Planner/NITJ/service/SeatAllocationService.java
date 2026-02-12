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

        Map<String, Queue<String>> queues =
                studentDataService.getStudentData(new ArrayList<>(allSubjects));

        queues.replaceAll((k, v) -> new LinkedList<>(v));

        if (queues.values().stream().noneMatch(q -> !q.isEmpty())) {
            throw new IllegalStateException("No students to allocate");
        }

        Deque<SubjectPair> pairQueue = new ArrayDeque<>();
        if (hasExplicitPairs) pairQueue.addAll(explicitPairs);

        List<RoomAllocation> allocations = new ArrayList<>();

        while (queues.values().stream().anyMatch(q -> !q.isEmpty())) {

            String subA;
            String subB = null;

            if (hasExplicitPairs) {
                SubjectPair pair = pairQueue.pollFirst();
                pairQueue.addLast(pair);

                subA = pair.getSubjectA();
                subB = pair.getSubjectB();

                if (isEmpty(queues, subA) && isEmpty(queues, subB)) continue;

            } else {
                List<String> active = queues.entrySet()
                        .stream()
                        .filter(e -> !e.getValue().isEmpty())
                        .map(Map.Entry::getKey)
                        .collect(Collectors.toList());

                if (active.isEmpty()) break;

                subA = active.get(0);
                if (active.size() > 1) subB = active.get(1);
            }

            Room room = getNextAvailableRoom(
                    request.getDate(),
                    request.getTime(),
                    allocationId,
                    usedRooms
            );

            if (room == null) {
                throw new IllegalStateException("Rooms exhausted while students remain");
            }

            usedRooms.add(room.getRoomCode());
            room.getUsableSeats().forEach(Seat::clear);

            Map<String, Integer> perRoomCount = new HashMap<>();
            List<SeatAssignment> seatAssignments = new ArrayList<>();

            allocateRoom(room, subA, subB, queues, perRoomCount, seatAssignments);

            if (seatAssignments.isEmpty()) {
                throw new IllegalStateException(
                        "Deadlock: no seats allocated in room " + room.getRoomCode());
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

        long remaining = queues.values().stream().mapToLong(Queue::size).sum();
        if (remaining > 0) {
            throw new IllegalStateException("Unallocated students remain: " + remaining);
        }

        return new AllocationResult(
                request.getDate(),
                request.getTime(),
                allocations
        );
    }

    // ----------------------------------------------------
    // Seat Allocation (30 cap ALWAYS enforced)
    // ----------------------------------------------------
    private void allocateRoom(Room room,
                              String subA,
                              String subB,
                              Map<String, Queue<String>> queues,
                              Map<String, Integer> perRoomCount,
                              List<SeatAssignment> out) {

        List<Seat> orderedSeats = getOrderedSeats(room);

        for (Seat seat : orderedSeats) {

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

    // ----------------------------------------------------
    // 🔥 LT symmetric ordering ONLY
    // ALT untouched
    // ----------------------------------------------------
    private List<Seat> getOrderedSeats(Room room) {

        List<Seat> seats = new ArrayList<>(room.getUsableSeats());

        if (room.getType() != Room.RoomType.LT) {
            return seats; // ALT untouched
        }

        // Only valid LT columns
        Set<Integer> validCols = Set.of(1, 2, 5, 7, 8);

        // Filter valid seats
        List<Seat> validSeats = seats.stream()
                .filter(s -> validCols.contains(s.getColumn()))
                .collect(Collectors.toList());

        // Group by column
        Map<Integer, List<Seat>> byColumn =
                validSeats.stream().collect(Collectors.groupingBy(Seat::getColumn));

        List<Integer> colOrder = List.of(1, 2, 5, 7, 8);

        List<Seat> ordered = new ArrayList<>();

        // First pass: Left section
        for (Integer col : colOrder) {
            List<Seat> colSeats = byColumn.getOrDefault(col, Collections.emptyList());
            colSeats.stream()
                    .filter(s -> "L".equals(s.getSection()))
                    .forEach(ordered::add);
        }

        // Second pass: Right section
        for (Integer col : colOrder) {
            List<Seat> colSeats = byColumn.getOrDefault(col, Collections.emptyList());
            colSeats.stream()
                    .filter(s -> "R".equals(s.getSection()))
                    .forEach(ordered::add);
        }

        return ordered;
    }

    private String allowedSubjectForSeat(Room room,
                                         Seat seat,
                                         String subA,
                                         String subB) {

        int col = seat.getColumn();
        String section = seat.getSection();

        if (room.getType() == Room.RoomType.LT) {

            // 🔹 SINGLE SUBJECT LT RULE
            if (subB == null) {

                if ("L".equals(section) &&
                        (col == 1 || col == 5 || col == 8)) {
                    return subA;
                }

                if ("R".equals(section) &&
                        (col == 2 || col == 7)) {
                    return subA;
                }

                return null;
            }

            // 🔹 DUAL SUBJECT LT RULE (existing placeholder logic)
            String placeholder = mapSeatToPlaceholder(room, seat);
            if (placeholder == null) return null;

            return "A".equals(placeholder) ? subA : subB;
        }

        // 🔹 ALT or others (unchanged)
        String placeholder = mapSeatToPlaceholder(room, seat);
        if (placeholder == null) return null;

        if (subB == null) return subA;

        return "A".equals(placeholder) ? subA : subB;
    }


    private String mapSeatToPlaceholder(Room room, Seat seat) {

        int col = seat.getColumn();
        String section = seat.getSection();

        if (room.getType() == Room.RoomType.LT) {

            if ("L".equals(section)) {
                return (col == 1 || col == 5 || col == 8) ? "A"
                        : (col == 2 || col == 7) ? "B"
                        : null;
            } else {
                return (col == 1 || col == 5 || col == 8) ? "B"
                        : (col == 2 || col == 7) ? "A"
                        : null;
            }
        }

        // ALT logic unchanged
        return col == 1 ? "A"
                : col == 3 ? "B"
                : null;
    }

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
                        !usedRooms.contains(r.getRoomCode()) &&
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
