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
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;

import java.io.*;
import java.util.*;
import java.util.List;

public class PdfGenerator {

    /* ================= SAFE SCALING ================= */

    private static float rowHeight = 14f;
    private static float seatFont = 7f;
    private static float headerFont = 8f;

    private static void adjustScaling(int rows) {

        rowHeight = 14f;
        seatFont = 7f;
        headerFont = 8f;

        if (rows <= 12) {
            rowHeight = 16f;
            seatFont = 7.5f;
        }

        if (rows >= 18) {
            rowHeight = 12f;
            seatFont = 6.5f;
            headerFont = 7.5f;
        }

        if (rows >= 22) {
            rowHeight = 10f;
            seatFont = 6f;
            headerFont = 7f;
        }
    }

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

            document.setMargins(15, 15, 10, 15);

            addHeader(document, room);
            addBlackBoard(document);

            SectionData data = extractSectionData(room);
            adjustScaling(data.maxRow);

            if (room.getType() == Room.RoomType.ALT)
                addALTLayout(document, room, data);
            else
                addLTLayout(document, room, data);

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
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold());

        doc.add(new Paragraph("EXAMINATION SECTION")
                .setFontSize(13)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold());

        doc.add(new Paragraph(
                "Seating Plan End Semester Examinations December 2025")
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER));

        doc.add(new Paragraph("ROOM NO.: " + room.getRoomCode())
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setMarginTop(6)
                .setMarginBottom(8));
    }

    /* ================= BLACK BOARD ================= */

    private static void addBlackBoard(Document doc) {

        Table table = new Table(1);
        table.setWidth(UnitValue.createPercentValue(100));

        table.addCell(new Cell()
                .add(new Paragraph("BLACK BOARD")
                        .setFontSize(11)
                        .setBold()
                        .setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(15, 23, 42))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(6)
                .setBorder(Border.NO_BORDER));

        doc.add(table);
    }

    /* ================= LT LAYOUT ================= */

    private static void addLTLayout(Document doc,
                                    RoomAllocation room,
                                    SectionData data) {

        Table main = new Table(new float[]{45, 10, 45});
        main.setWidth(UnitValue.createPercentValue(100));
        main.setKeepTogether(true); // Important fix

        main.addCell(sectionHeader("LEFT SIDE COLUMNS"));
        main.addCell(aisleCell(data.maxRow + 2));
        main.addCell(sectionHeader("RIGHT SIDE COLUMNS"));

        main.addCell(wrapper(createHeaderTable(data.leftCols,
                room.getSubjectPair(), "L", room.getType())));
        main.addCell(wrapper(createHeaderTable(data.rightCols,
                room.getSubjectPair(), "R", room.getType())));

        for (int r = 1; r <= data.maxRow; r++) {

            main.addCell(wrapper(
                    createDataRow(r, data.leftCols, "L", data.seatMap)));

            main.addCell(wrapper(
                    createDataRow(r, data.rightCols, "R", data.seatMap)));
        }

        appendWallAndTotals(main, room, 3);
        doc.add(main);
    }

    /* ================= ALT LAYOUT ================= */

    private static void addALTLayout(Document doc,
                                     RoomAllocation room,
                                     SectionData data) {

        Table main = new Table(new float[]{1, 0.05f, 1, 0.05f, 1});
        main.setWidth(UnitValue.createPercentValue(100));
        main.setFixedLayout();
        main.setKeepTogether(true); // Important fix

        main.addCell(sectionHeader("LEFT SIDE"));
        main.addCell(empty());
        main.addCell(sectionHeader("CENTRE"));
        main.addCell(empty());
        main.addCell(sectionHeader("RIGHT SIDE"));

        main.addCell(wrapper(createHeaderTable(data.leftCols,
                room.getSubjectPair(), "L", room.getType())));
        main.addCell(empty());
        main.addCell(wrapper(createHeaderTable(data.centreCols,
                room.getSubjectPair(), "C", room.getType())));
        main.addCell(empty());
        main.addCell(wrapper(createHeaderTable(data.rightCols,
                room.getSubjectPair(), "R", room.getType())));

        for (int r = 1; r <= data.maxRow; r++) {

            main.addCell(wrapper(
                    createDataRow(r, data.leftCols, "L", data.seatMap)));
            main.addCell(empty());
            main.addCell(wrapper(
                    createDataRow(r, data.centreCols, "C", data.seatMap)));
            main.addCell(empty());
            main.addCell(wrapper(
                    createDataRow(r, data.rightCols, "R", data.seatMap)));
        }

        appendWallAndTotals(main, room, 5);
        doc.add(main);
    }

    /* ================= WALL + TOTAL ================= */

    private static void appendWallAndTotals(Table main,
                                            RoomAllocation room,
                                            int span) {

        main.addCell(new Cell(1, span)
                .add(new Paragraph("WALL").setBold())
                .setBackgroundColor(new DeviceRgb(241,245,249))
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(3));

        main.addCell(new Cell(1, span)
                .add(new Paragraph(buildTotalText(room))
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER))
                .setBorder(Border.NO_BORDER)
                .setPaddingTop(3));
    }

    private static String buildTotalText(RoomAllocation room) {

        Map<String,Integer> count = new HashMap<>();

        for (SeatAssignment s : room.getAllocations())
            count.merge(s.getSubjectCode(),1,Integer::sum);

        StringBuilder sb = new StringBuilder();
        int i=0;

        for (String sub : room.getSubjectPair()) {

            String tag = sub.split("_")[0].toUpperCase();

            if (i++>0) sb.append(" & ");

            sb.append(tag)
                    .append("-")
                    .append(count.getOrDefault(sub,0));
        }

        sb.append(", TOTAL = ")
                .append(room.getAllocations().size());

        return sb.toString();
    }

    /* ================= TABLE BUILDERS ================= */

    private static Table createHeaderTable(int cols,
                                           List<String> subjects,
                                           String side,
                                           Room.RoomType type) {

        if (cols <= 0) cols = 1;

        float[] widths = new float[cols];
        Arrays.fill(widths, 1);

        Table table = new Table(widths);
        table.setWidth(UnitValue.createPercentValue(100));
        table.setFixedLayout();

        for (int i = 1; i <= cols; i++)
            table.addCell(styled(String.valueOf(i), seatFont, false, true));

        boolean single = subjects.size() == 1;
        String A = subjects.get(0).split("_")[0].toUpperCase();
        String B = single ? null :
                subjects.get(1).split("_")[0].toUpperCase();

        for (int col = 1; col <= cols; col++) {

            String text = "";

            if (type == Room.RoomType.LT) {

                if (single) {
                    if (side.equals("L") && Set.of(1,5,8).contains(col))
                        text = A;
                    if (side.equals("R") && Set.of(2,7).contains(col))
                        text = A;
                } else {
                    if (side.equals("L")) {
                        if (Set.of(1,5,8).contains(col)) text = A;
                        if (Set.of(2,7).contains(col)) text = B;
                    }
                    if (side.equals("R")) {
                        if (Set.of(2,7).contains(col)) text = A;
                        if (Set.of(1,5,8).contains(col)) text = B;
                    }
                }

            } else {

                if (single) {
                    if (col == 1) text = A;
                } else {
                    if (col == 1) text = A;
                    if (col == 3) text = B;
                }
            }

            table.addCell(styled(text, headerFont, true, false));
        }

        return table;
    }

    private static Table createDataRow(int row,
                                       int cols,
                                       String side,
                                       Map<String, SeatAssignment> map) {

        if (cols <= 0) cols = 1;

        float[] widths = new float[cols];
        Arrays.fill(widths, 1);

        Table table = new Table(widths);
        table.setWidth(UnitValue.createPercentValue(100));
        table.setFixedLayout();

        for (int col = 1; col <= cols; col++) {

            String id = side + row + "-" + col;
            SeatAssignment s = map.get(id);

            String val = (s == null)
                    ? "Vacant"
                    : s.getRollNo().replaceAll("\\D", "");

            table.addCell(styled(val, seatFont, false, false));
        }

        return table;
    }

    /* ================= STYLING ================= */

    private static Cell styled(String text,
                               float size,
                               boolean bold,
                               boolean grey) {

        Paragraph p = new Paragraph(text)
                .setFontSize(size)
                .setTextAlignment(TextAlignment.CENTER);

        if (bold) p.setBold();

        Cell c = new Cell()
                .add(p)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setMinHeight(rowHeight)
                .setPadding(2)
                .setBorder(new SolidBorder(new DeviceRgb(150,150,150), 0.5f));

        if (grey)
            c.setBackgroundColor(new DeviceRgb(235,238,243));

        return c;
    }

    private static Cell sectionHeader(String t) {
        return new Cell()
                .add(new Paragraph(t).setBold().setFontSize(9))
                .setTextAlignment(TextAlignment.CENTER)
                .setBackgroundColor(new DeviceRgb(220,226,236))
                .setPadding(4);
    }

    private static Cell aisleCell(int span) {
        return new Cell(span, 1)
                .add(new Paragraph("AISLE")
                        .setRotationAngle(Math.PI/2)
                        .setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setBackgroundColor(new DeviceRgb(241,245,249));
    }

    private static Cell wrapper(Table t) {
        return new Cell().add(t).setBorder(Border.NO_BORDER);
    }

    private static Cell empty() {
        return new Cell().setBorder(Border.NO_BORDER);
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

        SectionData d = new SectionData();

        for (SeatAssignment s : room.getAllocations()) {

            d.seatMap.put(s.getSeatId(), s);

            String[] p = s.getSeatId().split("-");
            int row = Integer.parseInt(p[0].replaceAll("[^0-9]", ""));
            int col = Integer.parseInt(p[1]);

            d.maxRow = Math.max(d.maxRow, row);

            if (s.getSeatId().startsWith("L"))
                d.leftCols = Math.max(d.leftCols, col);
            else if (s.getSeatId().startsWith("C"))
                d.centreCols = Math.max(d.centreCols, col);
            else if (s.getSeatId().startsWith("R"))
                d.rightCols = Math.max(d.rightCols, col);
        }

        // 🔥 FORCE 3 COLUMNS FOR ALT STRUCTURE
        if (room.getType() == Room.RoomType.ALT) {
            d.leftCols = 3;
            d.centreCols = 3;
            d.rightCols = 3;
        }

        return d;
    }

}
