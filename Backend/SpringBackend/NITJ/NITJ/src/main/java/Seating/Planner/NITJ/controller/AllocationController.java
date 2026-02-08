package Seating.Planner.NITJ.controller;

import Seating.Planner.NITJ.model.AllocationRequest;
import Seating.Planner.NITJ.model.AllocationResult;
import Seating.Planner.NITJ.service.BookingManager;
import Seating.Planner.NITJ.service.SeatAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/allocate")
@CrossOrigin(origins = "*")
public class AllocationController {

    @Autowired
    private SeatAllocationService allocationService;

    @Autowired
    private BookingManager bookingManager;

    /**
     * FIRST-TIME allocation
     * (AUTO mode or initial custom pairing)
     */
    @PostMapping
    public AllocationResult generateSeating(@RequestBody AllocationRequest request) {
        return allocationService.generateSeatingPlan(request);
    }

    /**
     * EDIT SUBJECT PAIRS
     * Rollback last allocation for date+time, then reallocate
     */
    @PostMapping("/reallocate")
    public AllocationResult reallocate(@RequestBody AllocationRequest request) {

        bookingManager.rollbackLastAllocation(
                request.getDate(),
                request.getTime()
        );

        return allocationService.generateSeatingPlan(request);
    }
}
