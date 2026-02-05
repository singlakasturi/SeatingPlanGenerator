package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.*;
import Seating.Planner.NITJ.util.ObjectMapperUtil;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Base64;

@Service
public class ExportService {

    public List<RoomFileDTO> generatePdfFiles(Map<String, Object> payload) {

        List<RoomFileDTO> files = new ArrayList<>();

        Object resultsObj = payload.get("results");
        if (!(resultsObj instanceof List<?> results)) {
            return files;
        }

        for (Object dayObj : results) {

            if (!(dayObj instanceof Map<?, ?> day)) continue;

            String date = String.valueOf(day.get("date"));

            Object responseObj = day.get("response");
            if (!(responseObj instanceof Map<?, ?> response)) continue;

            Object roomsObj = response.get("rooms");
            if (!(roomsObj instanceof List<?> rooms)) continue;

            // ✅ Collect all room PDFs for this date
            List<byte[]> roomPdfs = new ArrayList<>();

            for (Object roomObj : rooms) {
                RoomAllocation room =
                        ObjectMapperUtil.convert(roomObj, RoomAllocation.class);

                byte[] roomPdf = PdfGenerator.generate(room);
                roomPdfs.add(roomPdf);
            }

            // ✅ Merge into ONE date PDF
            byte[] mergedPdf = PdfGenerator.merge(roomPdfs);
            String base64 = Base64.getEncoder().encodeToString(mergedPdf);

            // ✅ ONE FILE PER DATE
            files.add(new RoomFileDTO(
                    date + ".pdf",
                    base64
            ));
        }

        return files;
    }
}
