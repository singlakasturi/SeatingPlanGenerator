package Seating.Planner.NITJ.controller;

import Seating.Planner.NITJ.service.StudentDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/test")
public class StudentLoadController {

    @Autowired
    private StudentDataService studentDataService;

    @GetMapping("/students/{subject}")
    public Map<String, Queue<String>> getStudents(@PathVariable String subject) {

        List<String> subjects = List.of(subject);

        return studentDataService.getStudentData(subjects);
    }
}