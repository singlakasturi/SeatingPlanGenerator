package Seating.Planner.NITJ.controller;


import Seating.Planner.NITJ.model.RoomBooking;
import Seating.Planner.NITJ.service.BookingManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingManager bookingManager;

    @GetMapping
    public List<RoomBooking> getAllBookings(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String time) {

        if (date != null && time != null) {
            return bookingManager.getBookingsFor(date, time);
        }
        return bookingManager.getAllBookings().values().stream()
                .flatMap(List::stream)
                .toList();
    }
}
