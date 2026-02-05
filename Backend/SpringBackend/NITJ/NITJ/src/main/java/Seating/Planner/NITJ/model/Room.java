package Seating.Planner.NITJ.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Room {

    private String roomCode;
    private RoomType type;
    private List<Section> sections;

    public enum RoomType { LT, ALT }

    public Room(String roomCode, RoomType type) {
        this.roomCode = roomCode;
        this.type = type;
        this.sections = new ArrayList<>();
        generateLayout();
    }

    // Generate structure for LT or ALT
    private void generateLayout() {
        if (type == RoomType.LT) {
            // left: 6 rows x 8 cols ; right: 6 rows x 8 cols
            sections.add(new Section("L", 6, 8)); // Left side
            sections.add(new Section("R", 6, 8)); // Right side
        } else if (type == RoomType.ALT) {
            // left 11x3, center 10x3, right 9x3
            sections.add(new Section("L", 11, 3)); // Left side
            sections.add(new Section("C", 10, 3)); // Centre side
            sections.add(new Section("R", 9, 3));  // Right side
        }
    }

    public String getRoomCode() { return roomCode; }
    public RoomType getType() { return type; }
    public List<Section> getSections() { return sections; }

    /**
     * Returns usable seats in column-major order, using the allowed columns per
     * room type/section so that we can allocate by column (L1-1, L2-1, L3-1...).
     * Limits the returned seats to at most 60 (room capacity).
     */
    public List<Seat> getUsableSeats() {
        List<Seat> ordered = new ArrayList<>();

        if (type == RoomType.LT) {
            // Allowed columns for LT (skip 3,4,6)
            int[] allowedCols = new int[] {1,2,5,7,8};

            Section left = sections.get(0);
            Section right = sections.get(1);

            for (int col : allowedCols) {
                for (int r = 1; r <= left.getRows(); r++) {
                    Seat s = left.getSeatAt(r, col);
                    if (s != null) ordered.add(s);
                    if (ordered.size() >= 60) return ordered;
                }
                for (int r = 1; r <= right.getRows(); r++) {
                    Seat s = right.getSeatAt(r, col);
                    if (s != null) ordered.add(s);
                    if (ordered.size() >= 60) return ordered;
                }
            }
        } else {
            // ALT: use columns 1 and 3 (col 2 vacant)
            int[] allowedCols = new int[] {1,3};
            for (int col : allowedCols) {
                for (Section sec : sections) {
                    for (int r = 1; r <= sec.getRows(); r++) {
                        Seat s = sec.getSeatAt(r, col);
                        if (s != null) ordered.add(s);
                        if (ordered.size() >= 60) return ordered;
                    }
                }
            }
        }

        return ordered.stream().limit(60).collect(Collectors.toList());
    }

    @Override
    public String toString() {
        return roomCode + " [" + type + "] (usable=" + getUsableSeats().size() + ")";
    }
}