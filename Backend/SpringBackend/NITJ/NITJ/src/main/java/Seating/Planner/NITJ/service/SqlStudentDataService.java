package Seating.Planner.NITJ.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@ConditionalOnProperty(name = "seating.data.mode", havingValue = "sql")
public class SqlStudentDataService implements StudentDataService {

    private final JdbcTemplate jdbcTemplate;

    public SqlStudentDataService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Map<String, Queue<String>> getStudentData(List<String> subjects) {

        Map<String, Queue<String>> result = new LinkedHashMap<>();

        for (String subject : subjects) {

            List<String> rolls = jdbcTemplate.query(
                    "SELECT roll_no FROM students WHERE subject_code = ? ORDER BY roll_no",
                    new Object[]{subject},
                    (rs, rowNum) -> rs.getString("roll_no")
            );

            result.put(subject, new LinkedList<>(rolls));
        }

        return result;
    }
}