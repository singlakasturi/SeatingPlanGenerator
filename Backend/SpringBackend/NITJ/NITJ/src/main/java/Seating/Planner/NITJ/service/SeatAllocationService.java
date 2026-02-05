package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.holder.RoomHolder;
import Seating.Planner.NITJ.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SeatAllocationService {

    @Autowired private RoomHolder roomHolder;
    @Autowired private StudentDataService studentDataService;
    @Autowired private BookingManager bookingManager;

    public AllocationResult generateSeatingPlan(AllocationRequest request) {

        Map<String, Queue<String>> original =
                studentDataService.getStudentData(request.getSubjectCode());

        Map<String, Queue<String>> queues = new LinkedHashMap<>();
        original.forEach((k, q) -> queues.put(k, new LinkedList<>(q)));

        Deque<String> subjectOrder = new ArrayDeque<>(queues.keySet());

        List<RoomAllocation> allocations = new ArrayList<>();

        while (anyQueueHasStudents(queues)) {

            Room room = getNextAvailableRoom(request.getDate(), request.getTime());
            if (room == null) {
                throw new IllegalStateException(
                        "Rooms exhausted while students still remain"
                );
            }

            room.getUsableSeats().forEach(Seat::clear);

            List<String> picked = new ArrayList<>();
            int tries = subjectOrder.size();

            while (picked.size() < 2 && tries-- > 0) {
                String s = subjectOrder.pollFirst();
                if (!queues.get(s).isEmpty()) {
                    picked.add(s);
                }
                subjectOrder.offerLast(s);
            }

            String subA = picked.size() > 0 ? picked.get(0) : null;
            String subB = picked.size() > 1 ? picked.get(1) : null;

// 🔑 overflow room: allow single subject to use whole room
            if (subA != null && subB == null && queues.size() > 1) {
                // force another subject if available
                for (String s : queues.keySet()) {
                    if (!s.equals(subA) && !queues.get(s).isEmpty()) {
                        subB = s;
                        break;
                    }
                }
            }

            Map<String, Integer> perRoomCount = new HashMap<>();
            List<SeatAssignment> seatAssignments = new ArrayList<>();

            allocateRoom(room, subA, subB, queues, perRoomCount, seatAssignments);

            List<String> bookedSubs = new ArrayList<>();
            if (subA != null) bookedSubs.add(subA);
            if (subB != null) bookedSubs.add(subB);

            bookingManager.addBooking(
                    room.getRoomCode(),
                    request.getDate(),
                    request.getTime(),
                    bookedSubs
            );

            allocations.add(new RoomAllocation(
                    room.getRoomCode(),
                    room.getType(),
                    bookedSubs,
                    seatAssignments
            ));
        }

        long remaining = queues.values().stream()
                .mapToLong(Queue::size)
                .sum();

        if (remaining > 0) {
            throw new IllegalStateException(
                    "Unallocated students remain: " + remaining);
        }

        return new AllocationResult(
                request.getDate(),
                request.getTime(),
                allocations
        );
    }

    private void allocateRoom(Room room,
                              String subA,
                              String subB,
                              Map<String, Queue<String>> queues,
                              Map<String, Integer> perRoomCount,
                              List<SeatAssignment> out) {

        for (Seat seat : room.getUsableSeats()) {

            String allowed = allowedSubjectForSeat(room, seat, subA, subB);
            if (allowed == null) continue;

            if (queues.get(allowed).isEmpty()) continue;
            if (perRoomCount.getOrDefault(allowed, 0) >= 30) continue;

            String roll = queues.get(allowed).poll();
            if (roll == null) continue;

            seat.assign(roll);
            out.add(new SeatAssignment(seat.getSeatId(), roll, allowed));

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

        // 🔑 single-subject overflow room → allow everywhere
        if (subA != null && subB == null) {
            return subA;
        }

        String placeholder = mapSeatToPlaceholder(room, seat, subA, subB);
        if ("A".equals(placeholder)) return subA;
        if ("B".equals(placeholder)) return subB;
        return null;
    }

    private String mapSeatToPlaceholder(Room room,
                                        Seat seat,
                                        String subA,
                                        String subB) {

        int col = seat.getColumn();
        String section = seat.getSection();

        if (room.getType() == Room.RoomType.LT) {
            if ("L".equals(section)) {
                return switch (col) {
                    case 1, 5, 8 -> "A";
                    case 2, 7 -> "B";
                    default -> null;
                };
            } else {
                return switch (col) {
                    case 1, 5, 8 -> "B";
                    case 2, 7 -> "A";
                    default -> null;
                };
            }
        } else { // ALT
            return switch (col) {
                case 1 -> "A";
                case 3 -> "B";
                default -> null;
            };
        }
    }

    private boolean anyQueueHasStudents(Map<String, Queue<String>> queues) {
        return queues.values().stream().anyMatch(q -> !q.isEmpty());
    }

    private Room getNextAvailableRoom(String date, String time) {
        return roomHolder.getAllRooms().stream()
                .filter(r ->
                        bookingManager.isRoomAvailable(
                                r.getRoomCode(), date, time))
                .findFirst()
                .orElse(null);
    }
}
