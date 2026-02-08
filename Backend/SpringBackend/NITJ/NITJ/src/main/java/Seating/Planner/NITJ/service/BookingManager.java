package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.RoomBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Seating.Planner.NITJ.service.AllocationHistoryService;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingManager {

    // roomCode -> list of bookings
    private final Map<String, List<RoomBooking>> bookingsByRoom = new HashMap<>();

    @Autowired
    private AllocationHistoryService allocationHistoryService;


    /**
     * Room is available if:
     * - it is NOT booked for the same date+time
     *   OR
     * - it is booked only by the SAME allocation (during reallocation)
     */
    public boolean isRoomAvailable(String roomCode,
                                   String date,
                                   String timeSlot,
                                   String allocationId) {

        List<RoomBooking> bookings =
                bookingsByRoom.getOrDefault(roomCode, Collections.emptyList());

        return bookings.stream().noneMatch(b ->
                b.getDate().equals(date)
                        && b.getTimeSlot().equals(timeSlot)
                        && !b.getAllocationId().equals(allocationId)
        );
    }

    /**
     * Add a booking owned by a specific allocation
     */
    public void addBooking(String allocationId,
                           String roomCode,
                           String date,
                           String timeSlot,
                           List<String> subjects) {

        RoomBooking booking =
                new RoomBooking(allocationId, roomCode, date, timeSlot, subjects);

        bookingsByRoom
                .computeIfAbsent(roomCode, k -> new ArrayList<>())
                .add(booking);
    }

    /**
     * Rollback ONLY the most recent allocation for a date+time
     */
    public void rollbackLastAllocation(String date, String timeSlot) {

        // Find latest allocationId for this date+time
        Optional<String> lastAllocationId =
                bookingsByRoom.values().stream()
                        .flatMap(List::stream)
                        .filter(b ->
                                b.getDate().equals(date)
                                        && b.getTimeSlot().equals(timeSlot)
                        )
                        .max(Comparator.comparing(RoomBooking::getCreatedAt))
                        .map(RoomBooking::getAllocationId);

        if (lastAllocationId.isEmpty()) {
            return; // nothing to rollback
        }

        String allocationId = lastAllocationId.get();


        // 1️⃣ REMOVE ROOM BOOKINGS
        for (Iterator<Map.Entry<String, List<RoomBooking>>> it =
             bookingsByRoom.entrySet().iterator(); it.hasNext(); ) {

            Map.Entry<String, List<RoomBooking>> entry = it.next();

            entry.getValue().removeIf(b ->
                    b.getAllocationId().equals(allocationId)
            );

            if (entry.getValue().isEmpty()) {
                it.remove();
            }
        }

        // 2️⃣ 🔥 REMOVE HISTORY ENTRY (THIS WAS MISSING)
        allocationHistoryService.removeLastFor(date, timeSlot);
    }


    /**
     * Get all bookings for a date+time (used by summary / export)
     */
    public List<RoomBooking> getBookingsFor(String date, String timeSlot) {

        return bookingsByRoom.values().stream()
                .flatMap(List::stream)
                .filter(b ->
                        b.getDate().equals(date)
                                && b.getTimeSlot().equals(timeSlot)
                )
                .collect(Collectors.toList());
    }

    /**
     * Debug / admin access
     */
    public Map<String, List<RoomBooking>> getAllBookings() {
        return bookingsByRoom;
    }

    public boolean isRoomBooked(String roomCode, String date, String timeSlot) {
        List<RoomBooking> bookings =
                bookingsByRoom.getOrDefault(roomCode, new ArrayList<>());

        return bookings.stream().anyMatch(b ->
                b.getDate().equals(date)
                        && b.getTimeSlot().equals(timeSlot)
        );
    }

}
