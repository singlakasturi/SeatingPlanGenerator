package Seating.Planner.NITJ.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
@ConditionalOnProperty(
        name = "seating.data.mode",
        havingValue = "excel",
        matchIfMissing = true   // default mode
)
public class ExcelStudentDataService implements StudentDataService {

    @Value("${studentdata.excel.path:classpath:students.xlsx}")
    private String excelPath;

    private final ResourceLoader resourceLoader;

    private Map<String, Queue<String>> cachedExcelData = null;

    public ExcelStudentDataService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Override
    public Map<String, Queue<String>> getStudentData(List<String> subjects) {

        if (cachedExcelData == null) {
            cachedExcelData = readExcelData();
        }

        Map<String, Queue<String>> result = new LinkedHashMap<>();

        for (String s : subjects) {
            String key = s.trim();
            // Try exact match or uppercase match
            Queue<String> found = cachedExcelData.get(key);
            if (found == null) {
                found = cachedExcelData.get(key.toUpperCase());
            }

            if (found != null && !found.isEmpty()) {
                result.put(s, new LinkedList<>(found));
            } else {
                // Fallback: Generate sample roll numbers if subject has no student data in Excel
                Queue<String> fallback = new LinkedList<>();
                String cleanCode = key.replaceAll("[^A-Za-z0-9]", "");
                for (int i = 1; i <= 30; i++) {
                    fallback.add(String.format("241%s%03d", cleanCode, i));
                }
                result.put(s, fallback);
            }
        }

        return result;
    }

    private Map<String, Queue<String>> readExcelData() {

        Map<String, Queue<String>> data = new LinkedHashMap<>();
        List<String> pathsToTry = List.of(excelPath, "classpath:Students3.xlsx", "classpath:Students.xlsx");

        for (String path : pathsToTry) {
            try {
                Resource resource = resourceLoader.getResource(path);
                if (!resource.exists()) continue;
                InputStream is = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(is);
                Sheet sheet = workbook.getSheetAt(0);

                int last = sheet.getPhysicalNumberOfRows();

                for (int r = 1; r < last; r++) {

                    Row row = sheet.getRow(r);
                    if (row == null) continue;

                    Cell subjectCell = row.getCell(0, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String subjectCode = getStringValue(subjectCell).trim();
                    if (subjectCode.isEmpty()) continue;

                    Cell rollCell = row.getCell(2, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String rollNo = getStringValue(rollCell).trim();
                    if (rollNo.isEmpty()) continue;

                    data.putIfAbsent(subjectCode, new LinkedList<>());
                    data.putIfAbsent(subjectCode.toUpperCase(), new LinkedList<>());
                    
                    data.get(subjectCode).add(rollNo);
                    if (!subjectCode.equals(subjectCode.toUpperCase())) {
                        data.get(subjectCode.toUpperCase()).add(rollNo);
                    }
                }

                workbook.close();

            } catch (Exception e) {
                // Ignore individual file load errors and try next path
            }
        }

        return data;
    }

    private String getStringValue(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
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
}