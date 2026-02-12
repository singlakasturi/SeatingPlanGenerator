package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.Room;
import Seating.Planner.NITJ.model.RoomAllocation;
import Seating.Planner.NITJ.model.SeatAssignment;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.utils.PdfMerger;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.*;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;

public class PdfGenerator {

    /* ================= MERGE ================= */

    public static byte[] merge(List<byte[]> pdfs) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfDocument mergedPdf = new PdfDocument(new PdfWriter(baos));
            PdfMerger merger = new PdfMerger(mergedPdf);

            for (byte[] pdfBytes : pdfs) {
                PdfDocument src = new PdfDocument(
                        new PdfReader(new ByteArrayInputStream(pdfBytes))
                );
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

    /* ================= GENERATE ================= */

    public static byte[] generate(RoomAllocation room) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
            Document document = new Document(pdf, PageSize.A4.rotate());
            document.setMargins(20, 20, 20, 20);

            addHeader(document, room);
            addBlackBoard(document);

            Room.RoomType type = room.getType();

            switch (type) {
                case LT:
                    addLTLayout(document, room);
                    break;
                case ALT:
                    addALTLayout(document, room);
                    break;
                default:
                    addLTLayout(document, room);
            }

            addWall(document);
            addTotals(document, room);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }

    /* ================= HEADER ================= */

    private static void addHeader(Document doc, RoomAllocation room) {

        doc.add(new Paragraph(
                "DR BR AMBEDKAR NATIONAL INSTITUTE OF TECHNOLOGY, JALANDHAR")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold());

        doc.add(new Paragraph("EXAMINATION SECTION")
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold());

        doc.add(new Paragraph(
                "Seating Plan End Semester Examinations December 2025")
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("ROOM NO.: " + room.getRoomCode())
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMarginTop(10)
                .setMarginBottom(10));
    }

    /* ================= BLACK BOARD ================= */

    private static void addBlackBoard(Document doc) {
        Table table = new Table(1);
        table.setWidth(UnitValue.createPercentValue(100));

        table.addCell(new Cell()
                .add(new Paragraph("BLACK BOARD")
                        .setFontSize(12)
                        .setBold()
                        .setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(15, 23, 42))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(8)
                .setBorder(Border.NO_BORDER));

        doc.add(table);
    }

    /* ================= TOTALS ================= */

    private static void addTotals(Document doc, RoomAllocation room) {

        Map<String, Integer> counts = new HashMap<>();
        for (SeatAssignment seat : room.getAllocations()) {
            counts.merge(seat.getSubjectCode(), 1, Integer::sum);
        }

        StringBuilder text = new StringBuilder();
        int idx = 0;

        for (String subject : room.getSubjectPair()) {
            String tag = subject.split("_")[0].toUpperCase();
            if (idx++ > 0) text.append(" & ");
            text.append(tag).append("-")
                    .append(counts.getOrDefault(subject, 0));
        }

        text.append(", TOTAL = ")
                .append(room.getAllocations().size());

        doc.add(new Paragraph(text.toString())
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMarginTop(10));
    }

    /* ================= LT LAYOUT ================= */

    private static void addLTLayout(Document doc, RoomAllocation room) {

        SectionData data = extractSectionData(room);

        Table mainTable = new Table(new float[]{45, 10, 45});
        mainTable.setWidth(UnitValue.createPercentValue(100));
        mainTable.setMarginTop(10);

        mainTable.addCell(createSectionHeader("LEFT SIDE COLUMNS"));

        mainTable.addCell(new Cell(data.maxRow + 2, 1)
                .add(new Paragraph("AISLE")
                        .setFontSize(9)
                        .setBold()
                        .setRotationAngle(Math.PI / 2))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBackgroundColor(new DeviceRgb(241, 245, 249)));

        mainTable.addCell(createSectionHeader("RIGHT SIDE COLUMNS"));

        mainTable.addCell(
                new Cell().add(createHeaderTable(data.leftCols, room.getSubjectPair()))
                        .setBorder(Border.NO_BORDER));

        mainTable.addCell(
                new Cell().add(createHeaderTable(data.rightCols, room.getSubjectPair()))
                        .setBorder(Border.NO_BORDER));

        for (int row = 1; row <= data.maxRow; row++) {

            mainTable.addCell(
                    new Cell().add(createDataRow(row, data.leftCols, "L", data.seatMap))
                            .setBorder(Border.NO_BORDER));

            mainTable.addCell(
                    new Cell().add(createDataRow(row, data.rightCols, "R", data.seatMap))
                            .setBorder(Border.NO_BORDER));
        }

        doc.add(mainTable);
    }

    /* ================= ALT LAYOUT ================= */

    private static void addALTLayout(Document doc, RoomAllocation room) {

        SectionData data = extractSectionData(room);

        Table mainTable = new Table(new float[]{34, 3, 33, 3, 30});
        mainTable.setWidth(UnitValue.createPercentValue(100));
        mainTable.setMarginTop(10);

        mainTable.addCell(createSectionHeader("LEFT SIDE"));
        mainTable.addCell(createEmptyCell());
        mainTable.addCell(createSectionHeader("CENTRE"));
        mainTable.addCell(createEmptyCell());
        mainTable.addCell(createSectionHeader("RIGHT SIDE"));

        mainTable.addCell(new Cell().add(createHeaderTable(data.leftCols, room.getSubjectPair())).setBorder(Border.NO_BORDER));
        mainTable.addCell(createEmptyCell());
        mainTable.addCell(new Cell().add(createHeaderTable(data.centreCols, room.getSubjectPair())).setBorder(Border.NO_BORDER));
        mainTable.addCell(createEmptyCell());
        mainTable.addCell(new Cell().add(createHeaderTable(data.rightCols, room.getSubjectPair())).setBorder(Border.NO_BORDER));

        for (int row = 1; row <= data.maxRow; row++) {

            mainTable.addCell(new Cell().add(createDataRow(row, data.leftCols, "L", data.seatMap)).setBorder(Border.NO_BORDER));
            mainTable.addCell(createEmptyCell());

            mainTable.addCell(new Cell().add(createDataRow(row, data.centreCols, "C", data.seatMap)).setBorder(Border.NO_BORDER));
            mainTable.addCell(createEmptyCell());

            mainTable.addCell(new Cell().add(createDataRow(row, data.rightCols, "R", data.seatMap)).setBorder(Border.NO_BORDER));
        }

        doc.add(mainTable);
    }

    /* ================= DATA EXTRACTION ================= */

    private static class SectionData {
        Map<String, SeatAssignment> seatMap = new HashMap<>();
        int maxRow = 0;
        int leftCols = 0;
        int centreCols = 0;
        int rightCols = 0;
    }

    private static SectionData extractSectionData(RoomAllocation room) {

        SectionData data = new SectionData();

        for (SeatAssignment seat : room.getAllocations()) {

            data.seatMap.put(seat.getSeatId(), seat);

            String[] parts = seat.getSeatId().split("-");
            if (parts.length == 2) {

                int row = Integer.parseInt(parts[0].replaceAll("[^0-9]", ""));
                int col = Integer.parseInt(parts[1]);

                data.maxRow = Math.max(data.maxRow, row);

                if (seat.getSeatId().startsWith("L"))
                    data.leftCols = Math.max(data.leftCols, col);

                else if (seat.getSeatId().startsWith("C"))
                    data.centreCols = Math.max(data.centreCols, col);

                else if (seat.getSeatId().startsWith("R"))
                    data.rightCols = Math.max(data.rightCols, col);
            }
        }

        return data;
    }

    /* ================= HELPERS ================= */

    private static Table createHeaderTable(int cols, List<String> subjectPair) {

        if (cols <= 0) cols = 1;   // prevent crash

        Table header = new Table(cols);
        header.setWidth(UnitValue.createPercentValue(100));

        for (int col = 1; col <= cols; col++) {
            header.addCell(new Cell()
                    .add(new Paragraph(String.valueOf(col)).setFontSize(7))
                    .setTextAlignment(TextAlignment.CENTER));
        }

        for (int col = 1; col <= cols; col++) {

            String subject = subjectPair.get((col - 1) % subjectPair.size())
                    .split("_")[0].toUpperCase();

            header.addCell(new Cell()
                    .add(new Paragraph(subject).setFontSize(8).setBold())
                    .setTextAlignment(TextAlignment.CENTER));
        }

        return header;
    }

    private static Table createDataRow(int row, int cols,
                                       String side,
                                       Map<String, SeatAssignment> seatMap) {

        if (cols <= 0) cols = 1;
        Table table = new Table(cols);
        table.setWidth(UnitValue.createPercentValue(100));

        for (int col = 1; col <= cols; col++) {

            String seatId = side + row + "-" + col;
            SeatAssignment seat = seatMap.get(seatId);

            Cell cell = new Cell()
                    .setPadding(4)
                    .setTextAlignment(TextAlignment.CENTER);

            if (seat != null) {
                cell.add(new Paragraph(
                        seat.getRollNo().replaceAll("\\D", ""))
                        .setFontSize(7));
            } else {
                cell.add(new Paragraph("Vacant")
                        .setFontSize(7)
                        .setItalic());
            }

            table.addCell(cell);
        }

        return table;
    }

    private static Cell createSectionHeader(String title) {
        return new Cell()
                .add(new Paragraph(title).setFontSize(9).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setPadding(5);
    }

    private static Cell createEmptyCell() {
        return new Cell().setBorder(Border.NO_BORDER);
    }

    private static void addWall(Document doc) {
        Table wall = new Table(1);
        wall.setWidth(UnitValue.createPercentValue(100));
        wall.setMarginTop(5);

        wall.addCell(new Cell()
                .add(new Paragraph("WALL").setFontSize(10).setBold())
                .setBackgroundColor(new DeviceRgb(241, 245, 249))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(5));

        doc.add(wall);
    }
}
