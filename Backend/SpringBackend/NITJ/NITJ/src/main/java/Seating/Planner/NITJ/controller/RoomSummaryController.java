package Seating.Planner.NITJ.controller;


import Seating.Planner.NITJ.model.RoomSummaryResponse;
import Seating.Planner.NITJ.service.RoomSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "*")
public class RoomSummaryController {

    @Autowired
    private RoomSummaryService summaryService;

    @GetMapping
    public RoomSummaryResponse getSummary(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String time) {
        return summaryService.getSummary(date, time);
    }
}
