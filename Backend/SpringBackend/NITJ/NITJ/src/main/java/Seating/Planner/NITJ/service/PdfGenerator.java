// package Seating.Planner.NITJ.service;

// import Seating.Planner.NITJ.model.RoomAllocation;
// import Seating.Planner.NITJ.model.SeatAssignment;

// import com.lowagie.text.*;
// import com.lowagie.text.pdf.*;

// import java.io.ByteArrayOutputStream;

// public class PdfGenerator {

//     public static byte[] generate(RoomAllocation room) {
//         try {
//             Document doc = new Document(PageSize.A4);
//             ByteArrayOutputStream out = new ByteArrayOutputStream();
//             PdfWriter.getInstance(doc, out);
//             doc.open();

//             // Header
//             doc.add(new Paragraph(
//                 "DR B R AMBEDKAR NATIONAL INSTITUTE OF TECHNOLOGY, JALANDHAR",
//                 FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)
//             ));
//             doc.add(new Paragraph("Room No: " + room.getRoomCode()));
//             doc.add(new Paragraph(" "));

//             // Blackboard
//             Paragraph board = new Paragraph(
//                 "BLACK BOARD",
//                 FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)
//             );
//             board.setAlignment(Element.ALIGN_CENTER);
//             doc.add(board);
//             doc.add(new Paragraph(" "));

//             // Seat table (3 columns like PreviewRoom: L C R)
//             PdfPTable table = new PdfPTable(3);
//             table.setWidthPercentage(100);

//             for (SeatAssignment s : room.getAllocations()) {
//                 String text =
//                         s.getSeatId() + "\n" +
//                         (s.getRollNo() == null ? "Vacant" : s.getRollNo());

//                 PdfPCell cell = new PdfPCell(new Phrase(text));
//                 cell.setHorizontalAlignment(Element.ALIGN_CENTER);
//                 cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
//                 cell.setFixedHeight(28f);

//                 table.addCell(cell);
//             }

//             doc.add(table);
//             doc.close();
//             return out.toByteArray();

//         } catch (Exception e) {
//             throw new RuntimeException("PDF generation failed", e);
//         }
//     }
// }

package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.RoomAllocation;
import Seating.Planner.NITJ.model.SeatAssignment;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.itextpdf.kernel.utils.PdfMerger;
import com.itextpdf.kernel.pdf.PdfReader;
import java.io.ByteArrayOutputStream;
import java.util.*;

public class PdfGenerator {


    public static byte[] merge(List<byte[]> pdfs) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfDocument mergedPdf = new PdfDocument(new PdfWriter(baos));
            PdfMerger merger = new PdfMerger(mergedPdf);

            for (byte[] pdfBytes : pdfs) {
                PdfDocument src = new PdfDocument(new PdfReader(new java.io.ByteArrayInputStream(pdfBytes)));
                merger.merge(src, 1, src.getNumberOfPages());
                src.close();
            }

            mergedPdf.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }


    public static byte[] generate(RoomAllocation room) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4.rotate()); // LANDSCAPE
            document.setMargins(20, 20, 20, 20);

            // ✅ HEADER
            addHeader(document, room);

            // ✅ BLACK BOARD
            addBlackBoard(document);

            // ✅ SEATING LAYOUT
            if ("LT".equals(room.getType())) {
                addLTLayout(document, room);
            } else if ("ALT".equals(room.getType())) {
                addALTLayout(document, room);
            } else {
                addStandardLayout(document, room);
            }

            // ✅ WALL
            addWall(document);

            // ✅ TOTALS
            addTotals(document, room);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    private static void addHeader(Document doc, RoomAllocation room) {
        Paragraph title = new Paragraph("DR BR AMBEDKAR NATIONAL INSTITUTE OF TECHNOLOGY, JALANDHAR")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold();
        doc.add(title);

        Paragraph examSection = new Paragraph("EXAMINATION SECTION")
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold();
        doc.add(examSection);

        Paragraph seatingPlan = new Paragraph("Seating Plan End Semester Examinations December 2025")
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER);
        doc.add(seatingPlan);

        Paragraph roomInfo = new Paragraph("ROOM NO.: " + room.getRoomCode() + " | BTECH 1st Year Semester (2024 Batch)")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMarginTop(10)
                .setMarginBottom(10);
        doc.add(roomInfo);
    }

    private static void addBlackBoard(Document doc) {
        Table blackBoard = new Table(1);
        blackBoard.setWidth(UnitValue.createPercentValue(100));

        Cell cell = new Cell()
                .add(new Paragraph("BLACK BOARD")
                        .setFontSize(12)
                        .setBold()
                        .setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(15, 23, 42))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(8)
                .setBorder(Border.NO_BORDER);

        blackBoard.addCell(cell);
        doc.add(blackBoard);
    }

    private static void addWall(Document doc) {
        Table wall = new Table(1);
        wall.setWidth(UnitValue.createPercentValue(100));
        wall.setMarginTop(5);

        Cell cell = new Cell()
                .add(new Paragraph("WALL")
                        .setFontSize(10)
                        .setBold())
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(5)
                .setBorder(new SolidBorder(new DeviceRgb(203, 213, 225), 1));

        wall.addCell(cell);
        doc.add(wall);
    }

    private static void addTotals(Document doc, RoomAllocation room) {
        Map<String, Integer> counts = new HashMap<>();
        for (SeatAssignment seat : room.getAllocations()) {
            counts.merge(seat.getSubjectCode(), 1, Integer::sum);
        }

        StringBuilder totalsText = new StringBuilder();
        int idx = 0;
        for (String subject : room.getSubjectPair()) {
            String tag = subject.split("_")[0].toUpperCase();
            if (idx > 0) totalsText.append(" & ");
            totalsText.append(tag).append("-").append(counts.getOrDefault(subject, 0));
            idx++;
        }
        totalsText.append(", TOTAL = ").append(room.getAllocations().size());

        Paragraph totals = new Paragraph(totalsText.toString())
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMarginTop(10);
        doc.add(totals);
    }

    private static void addLTLayout(Document doc, RoomAllocation room) {
        // ✅ PARSE SEATS INTO LEFT/RIGHT MATRIX
        Map<String, SeatAssignment> seatMap = new HashMap<>();
        int maxRow = 0, maxCol = 0;

        for (SeatAssignment seat : room.getAllocations()) {
            seatMap.put(seat.getSeatId(), seat);
            String[] parts = seat.getSeatId().split("-");
            if (parts.length == 2) {
                int row = Integer.parseInt(parts[0].substring(1));
                int col = Integer.parseInt(parts[1]);
                maxRow = Math.max(maxRow, row);
                maxCol = Math.max(maxCol, col);
            }
        }

        // ✅ CREATE MAIN TABLE (LEFT SIDE | AISLE | RIGHT SIDE)
        Table mainTable = new Table(new float[]{45, 10, 45});
        mainTable.setWidth(UnitValue.createPercentValue(100));
        mainTable.setMarginTop(10);

        // ✅ LEFT SIDE TITLE
        Cell leftTitle = new Cell()
                .add(new Paragraph("LEFT SIDE COLUMNS").setFontSize(9).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setPadding(5);
        mainTable.addCell(leftTitle);

        // ✅ AISLE CELL (SPANS ALL ROWS)
        Cell aisleCell = new Cell(maxRow + 2, 1)
                .add(new Paragraph("AISLE").setFontSize(9).setBold().setRotationAngle(Math.PI / 2))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setBorder(new SolidBorder(new DeviceRgb(226, 232, 240), 1));
        mainTable.addCell(aisleCell);

        // ✅ RIGHT SIDE TITLE
        Cell rightTitle = new Cell()
                .add(new Paragraph("RIGHT SIDE COLUMNS").setFontSize(9).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setPadding(5);
        mainTable.addCell(rightTitle);

        // ✅ HEADER ROW (COLUMN NUMBERS & SUBJECTS)
        Table leftHeader = createHeaderTable(maxCol, room.getSubjectPair());
        Table rightHeader = createHeaderTable(maxCol, room.getSubjectPair());

        mainTable.addCell(new Cell().add(leftHeader).setBorder(Border.NO_BORDER));
        mainTable.addCell(new Cell().add(rightHeader).setBorder(Border.NO_BORDER));

        // ✅ DATA ROWS
        for (int row = 1; row <= maxRow; row++) {
            Table leftRow = createDataRow(row, maxCol, "L", seatMap);
            Table rightRow = createDataRow(row, maxCol, "R", seatMap);

            mainTable.addCell(new Cell().add(leftRow).setBorder(Border.NO_BORDER));
            mainTable.addCell(new Cell().add(rightRow).setBorder(Border.NO_BORDER));
        }

        doc.add(mainTable);
    }

    private static Table createHeaderTable(int maxCol, List<String> subjectPair) {
        Table header = new Table(maxCol);
        header.setWidth(UnitValue.createPercentValue(100));

        // ✅ ROW 1: COLUMN NUMBERS
        for (int col = 1; col <= maxCol; col++) {
            Cell cell = new Cell()
                    .add(new Paragraph(String.valueOf(col)).setFontSize(7))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(241, 245, 249))
                    .setPadding(3)
                    .setBorder(new SolidBorder(new DeviceRgb(148, 163, 184), 1));
            header.addCell(cell);
        }

        // ✅ ROW 2: SUBJECT TAGS
        for (int col = 1; col <= maxCol; col++) {
            String subject = subjectPair.get((col - 1) % subjectPair.size()).split("_")[0].toUpperCase();
            Cell cell = new Cell()
                    .add(new Paragraph(subject).setFontSize(8).setBold())
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(ColorConstants.WHITE)
                    .setPadding(3)
                    .setBorder(new SolidBorder(new DeviceRgb(148, 163, 184), 1));
            header.addCell(cell);
        }

        return header;
    }

    private static Table createDataRow(int row, int maxCol, String side, Map<String, SeatAssignment> seatMap) {
        Table rowTable = new Table(maxCol);
        rowTable.setWidth(UnitValue.createPercentValue(100));

        for (int col = 1; col <= maxCol; col++) {
            String seatId = side + row + "-" + col;
            SeatAssignment seat = seatMap.get(seatId);

            Cell cell = new Cell().setPadding(4).setTextAlignment(TextAlignment.CENTER)
                    .setBorder(new SolidBorder(new DeviceRgb(148, 163, 184), 1));

            if (seat != null) {
                String rollNo = seat.getRollNo().replaceAll("\\D", "");
                cell.add(new Paragraph(rollNo).setFontSize(7));

                if (seat.getNote() != null && !seat.getNote().trim().isEmpty()) {
                    cell.add(new Paragraph(seat.getNote())
                            .setFontSize(6)
                            .setFontColor(new DeviceRgb(220, 38, 38))
                            .setItalic()
                            .setBold());
                }
                cell.setBackgroundColor(ColorConstants.WHITE);
            } else {
                cell.add(new Paragraph("Vacant").setFontSize(7).setItalic())
                        .setBackgroundColor(new DeviceRgb(248, 250, 252))
                        .setFontColor(new DeviceRgb(203, 213, 225));
            }

            rowTable.addCell(cell);
        }

        return rowTable;
    }

    private static void addALTLayout(Document doc, RoomAllocation room) {
        // ✅ SIMILAR TO LT BUT WITH 3 SECTIONS (L, C, R)
        // Parse seats into sections
        Map<String, List<SeatAssignment>> sections = new HashMap<>();
        sections.put("L", new ArrayList<>());
        sections.put("C", new ArrayList<>());
        sections.put("R", new ArrayList<>());

        for (SeatAssignment seat : room.getAllocations()) {
            String side = seat.getSeatId().substring(0, 1);
            sections.computeIfAbsent(side, k -> new ArrayList<>()).add(seat);
        }

        // ✅ CREATE TABLE WITH 5 COLUMNS (L | AISLE | C | AISLE | R)
        Table mainTable = new Table(new float[]{30, 5, 30, 5, 30});
        mainTable.setWidth(UnitValue.createPercentValue(100));
        mainTable.setMarginTop(10);

        // ✅ HEADERS
        mainTable.addCell(createSectionHeader("Left Side"));
        mainTable.addCell(createAislePlaceholder());
        mainTable.addCell(createSectionHeader("Centre"));
        mainTable.addCell(createAislePlaceholder());
        mainTable.addCell(createSectionHeader("Right Side"));

        // ✅ ADD SECTION DATA
        // (Implementation similar to LT but with 3 sections)

        doc.add(mainTable);
    }

    private static void addStandardLayout(Document doc, RoomAllocation room) {
        // ✅ SIMPLE 2-COLUMN LAYOUT
        addLTLayout(doc, room); // Use same layout as LT
    }

    private static Cell createSectionHeader(String title) {
        return new Cell()
                .add(new Paragraph(title).setFontSize(9).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setPadding(5);
    }

    private static Cell createAislePlaceholder() {
        return new Cell()
                .add(new Paragraph("AISLE").setFontSize(7).setBold().setRotationAngle(Math.PI / 2))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBackgroundColor(new DeviceRgb(238, 242, 246))
                .setBorder(new SolidBorder(new DeviceRgb(203, 213, 225), 1));
    }
}