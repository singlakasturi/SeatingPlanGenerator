// package Seating.Planner.NITJ.controller;

// import Seating.Planner.NITJ.model.AllocationRequest;
// import Seating.Planner.NITJ.model.AllocationResult;
// import Seating.Planner.NITJ.service.AllocationHistoryService;
// import Seating.Planner.NITJ.service.SeatAllocationService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/allocate")
// @CrossOrigin(origins = "*")
// public class AllocationController {

//     @Autowired
//     private SeatAllocationService allocationService;

//     @Autowired
//     private AllocationHistoryService historyService;

//     @PostMapping
//     public Map<String, Object> generateSeating(@RequestBody AllocationRequest request) {
//         AllocationResult result = allocationService.generateSeatingPlan(request);

//         // Prepare full payload for history storage
//         Map<String, Object> fullPayload = new HashMap<>();
//         fullPayload.put("date", result.getDate());
//         fullPayload.put("time", result.getTime());
//         fullPayload.put("rooms", result.getRooms());
//         fullPayload.put("request", request);

//         // Save to history
//         int savedIndex = historyService.saveAllocation(fullPayload);

//         // Return result with history index
//         Map<String, Object> response = new HashMap<>();
//         response.put("date", result.getDate());
//         response.put("time", result.getTime());
//         response.put("rooms", result.getRooms());
//         response.put("historyIndex", savedIndex);

//         return response;
//     }
// }





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