package Seating.Planner.NITJ.service;

import java.util.*;

public interface StudentDataService {
    Map<String, Queue<String>> getStudentData(List<String> subjects);
}