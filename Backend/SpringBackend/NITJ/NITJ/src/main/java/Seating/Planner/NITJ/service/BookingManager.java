package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.RoomBooking;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class BookingManager {

    private final Map<String, List<RoomBooking>> bookingsByRoom = new HashMap<>();

    public boolean isRoomAvailable(String roomCode, String date, String timeSlot) {
        List<RoomBooking> bookings = bookingsByRoom.getOrDefault(roomCode, new ArrayList<>());
        return bookings.stream().noneMatch(b ->
                b.getDate().equals(date) && b.getTimeSlot().equals(timeSlot)
        );
    }

    public void addBooking(String roomCode, String date, String timeSlot, List<String> subjects) {
        RoomBooking booking = new RoomBooking(roomCode, date, timeSlot, subjects);
        bookingsByRoom.computeIfAbsent(roomCode, k -> new ArrayList<>()).add(booking);
    }

    public List<RoomBooking> getBookingsFor(String date, String timeSlot) {
        List<RoomBooking> result = new ArrayList<>();
        for (List<RoomBooking> list : bookingsByRoom.values()) {
            for (RoomBooking b : list) {
                if (b.getDate().equals(date) && b.getTimeSlot().equals(timeSlot)) {
                    result.add(b);
                }
            }
        }
        return result;
    }

    public Map<String, List<RoomBooking>> getAllBookings() {
        return bookingsByRoom;
    }
}