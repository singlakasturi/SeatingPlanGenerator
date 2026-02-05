package Seating.Planner.NITJ.controller;


import Seating.Planner.NITJ.model.AllocationRequest;
import Seating.Planner.NITJ.model.AllocationResult;
import Seating.Planner.NITJ.service.SeatAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/allocate")
@CrossOrigin(origins = "*")
public class AllocationController {

    @Autowired
    private SeatAllocationService allocationService;

    @PostMapping
    public AllocationResult generateSeating(@RequestBody AllocationRequest request) {
        return allocationService.generateSeatingPlan(request);
    }
}
