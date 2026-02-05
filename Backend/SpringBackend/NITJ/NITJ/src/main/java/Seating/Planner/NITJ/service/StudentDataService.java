package Seating.Planner.NITJ.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentDataService {

    @Value("${studentdata.mock:true}")
    private boolean mockMode;

    @Value("${studentdata.excel.path:classpath:students.xlsx}")
    private String excelPath;

    private final ResourceLoader resourceLoader;

    // cache so we read excel only once
    private Map<String, Queue<String>> cachedExcelData = null;

    public StudentDataService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    // PUBLIC API
    public Map<String, Queue<String>> getStudentData(List<String> subjects) {

        if (mockMode) {
            System.out.println("⚠ MOCK MODE ENABLED → Generating fake students.");
            return generateMockData(subjects);
        }

        if (cachedExcelData == null) {
            System.out.println("📘 Loading REAL student data from Excel: " + excelPath);
            cachedExcelData = readExcelData();
        }

        // Return copies of queues for requested subjects
        Map<String, Queue<String>> result = new LinkedHashMap<>();
        for (String s : subjects) {
            if (cachedExcelData.containsKey(s)) {
                // copy so allocation can poll without modifying cache
                result.put(s, new LinkedList<>(cachedExcelData.get(s)));
            } else {
                result.put(s, new LinkedList<>());
            }
        }
        return result;
    }

    // READ EXCEL
    private Map<String, Queue<String>> readExcelData() {

        Map<String, Queue<String>> data = new LinkedHashMap<>();

        try {
            Resource resource = resourceLoader.getResource(excelPath);
            InputStream is = resource.getInputStream();
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);

            int last = sheet.getPhysicalNumberOfRows();   // ✅ safer than getLastRowNum()

            for (int r = 1; r < last; r++) {

                Row row = sheet.getRow(r);
                if (row == null) continue;

                // ---- READ SUBJECT CODE SAFELY ----
                Cell subjectCell = row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                String subjectCode = getStringValue(subjectCell).trim();
                if (subjectCode.isEmpty()) continue;

                // ---- READ ROLL NO SAFELY ----
                Cell rollCell = row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                String rollNo = getStringValue(rollCell).trim();
                if (rollNo.isEmpty()) continue;

                // ---- STORE INTO MAP ----
                data.putIfAbsent(subjectCode, new LinkedList<>());
                data.get(subjectCode).add(rollNo);
            }

            workbook.close();
            System.out.println("✅ Loaded " + data.size() + " subjects from Excel.");

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Failed to load students.xlsx");
        }

        return data;
    }

    // Normalize cell -> string for STRING / NUMERIC / FORMULA / BOOLEAN
    private String getStringValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                // remove decimal part (roll numbers often parsed as numeric)
                long lv = (long) cell.getNumericCellValue();
                return String.valueOf(lv);
            case FORMULA:
                try {
                    return cell.getStringCellValue();
                } catch (Exception ex) {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private Map<String, Queue<String>> generateMockData(List<String> subjects) {
        Map<String, Queue<String>> mock = new LinkedHashMap<>();
        for (String s : subjects) {
            Queue<String> q = new LinkedList<>();
            for (int i = 1; i <= 60; i++) q.add(s.substring(0,2).toUpperCase() + String.format("%03d", i));
            mock.put(s, q);
        }
        return mock;
    }
}