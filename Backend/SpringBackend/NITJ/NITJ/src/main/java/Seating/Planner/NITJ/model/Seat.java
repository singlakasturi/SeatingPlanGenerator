package Seating.Planner.NITJ.model;

public class Seat {

    private String section;
    private int row;
    private int column;
    private boolean occupied;
    private String rollNo;

    public Seat(String section, int row, int column) {
        this.section = section;
        this.row = row;
        this.column = column;
        this.occupied = false;
        this.rollNo = null;
    }

    public String getSection() { return section; }
    public int getRow() { return row; }
    public int getColumn() { return column; }
    public boolean isOccupied() { return occupied; }
    public String getRollNo() { return rollNo; }

    public void assign(String rollNo) {
        this.occupied = true;
        this.rollNo = rollNo;
    }

    public void clear() {
        this.occupied = false;
        this.rollNo = null;
    }

    public String getSeatId() {
        return section + row + "-" + column;
    }

    @Override
    public String toString() {
        return getSeatId() + (occupied ? " [" + rollNo + "]" : "");
    }
}