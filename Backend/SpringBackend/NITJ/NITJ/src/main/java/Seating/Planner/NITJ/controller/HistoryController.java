// package Seating.Planner.NITJ.controller;

// import Seating.Planner.NITJ.model.AllocationHistoryEntry;
// import Seating.Planner.NITJ.service.AllocationHistoryService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/history")
// @CrossOrigin(origins = "*")
// public class HistoryController {

//     @Autowired
//     private AllocationHistoryService historyService;

//     /**
//      * Get all previous allocation plans
//      */
//     @GetMapping
//     public List<AllocationHistoryEntry> getAllHistory() {
//         return historyService.getAllHistory();
//     }

//     /**
//      * Get specific allocation plan by index
//      */
//     @GetMapping("/{index}")
//     public ResponseEntity<?> getByIndex(@PathVariable int index) {
//         try {
//             AllocationHistoryEntry entry = historyService.getByIndex(index);
//             return ResponseEntity.ok(entry);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//         }
//     }

//     /**
//      * Delete allocation plan by index
//      */
//     @DeleteMapping("/{index}")
//     public ResponseEntity<?> deleteByIndex(@PathVariable int index) {
//         boolean deleted = historyService.deleteByIndex(index);
//         if (deleted) {
//             return ResponseEntity.ok(Map.of("success", true, "message", "Plan deleted"));
//         }
//         return ResponseEntity.badRequest().body(Map.of("error", "Plan not found"));
//     }
// }





package Seating.Planner.NITJ.controller;

import Seating.Planner.NITJ.model.AllocationHistoryEntry;
import Seating.Planner.NITJ.service.AllocationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    private AllocationHistoryService historyService;

    /**
     * Save new allocation to history
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveAllocation(@RequestBody Map<String, Object> payload) {
        try {
            int index = historyService.saveAllocation(payload);
            return ResponseEntity.ok(Map.of("success", true, "index", index));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all previous allocation plans
     */
    @GetMapping
    public List<AllocationHistoryEntry> getAllHistory() {
        return historyService.getAllHistory();
    }

    /**
     * Get specific allocation plan by index
     */
    @GetMapping("/{index}")
    public ResponseEntity<?> getByIndex(@PathVariable int index) {
        try {
            AllocationHistoryEntry entry = historyService.getByIndex(index);
            return ResponseEntity.ok(entry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete allocation plan by index
     */
    @DeleteMapping("/{index}")
    public ResponseEntity<?> deleteByIndex(@PathVariable int index) {
        boolean deleted = historyService.deleteByIndex(index);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Plan deleted"));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Plan not found"));
    }
}