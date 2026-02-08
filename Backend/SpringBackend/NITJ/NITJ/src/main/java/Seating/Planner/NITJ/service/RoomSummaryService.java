package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.holder.RoomHolder;
import Seating.Planner.NITJ.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoomSummaryService {

    @Autowired
    private RoomHolder roomHolder;

    @Autowired
    private BookingManager bookingManager;

    public RoomSummaryResponse getSummary(String date, String time) {

        List<Room> allRooms = roomHolder.getAllRooms();
        int total = allRooms.size();
        int booked = 0;

        List<String> bookedRooms = new ArrayList<>();

        for (Room room : allRooms) {
            if (bookingManager.isRoomBooked(
                    room.getRoomCode(), date, time
            )) {
                booked++;
                bookedRooms.add(room.getRoomCode());
            }
        }

        return new RoomSummaryResponse(
                total,
                booked,
                total - booked,
                bookedRooms
        );
    }
}
