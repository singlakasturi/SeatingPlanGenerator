package Seating.Planner.NITJ.controller;

import Seating.Planner.NITJ.model.RoomFileDTO;
import Seating.Planner.NITJ.service.ExportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "http://localhost:5000")
public class ExportController {

    @Autowired
    private ExportService exportService;


    @PostMapping("/pdf")
    public List<RoomFileDTO> exportPdf(
            @RequestBody Map<String, Object> payload
    ) {
        return exportService.generatePdfFiles(payload);
    }

}