package Seating.Planner.NITJ.service;


import Seating.Planner.NITJ.holder.RoomHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Seating.Planner.NITJ.model.*;

import java.util.*;

@Service
public class RoomSummaryService {

    @Autowired private RoomHolder roomHolder;
    @Autowired private BookingManager bookingManager;

    public RoomSummaryResponse getSummary(String date, String time) {
        List<Room> all = roomHolder.getAllRooms();
        int total = all.size(), booked = 0;
        List<String> bookedRooms = new ArrayList<>();
        for (Room r : all) {
            if (!bookingManager.isRoomAvailable(r.getRoomCode(), date, time)) {
                booked++;
                bookedRooms.add(r.getRoomCode());
            }
        }
        return new RoomSummaryResponse(total, booked, total - booked, bookedRooms);
    }
}
