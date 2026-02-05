package Seating.Planner.NITJ.model;

import java.util.ArrayList;
import java.util.List;

public class Section {

    private String name; // L / C / R
    private int rows;
    private int cols;
    private List<Seat> seats;

    public Section(String name, int rows, int cols) {
        this.name = name;
        this.rows = rows;
        this.cols = cols;
        this.seats = new ArrayList<>();
        generateSeats();
    }

    private void generateSeats() {
        for (int r = 1; r <= rows; r++) {
            for (int c = 1; c <= cols; c++) {
                seats.add(new Seat(name, r, c));
            }
        }
    }

    public String getName() { return name; }
    public int getRows() { return rows; }
    public int getCols() { return cols; }

    public List<Seat> getSeats() { return seats; }

    /**
     * helper to find a seat by row/col in this section (returns null if out of bounds)
     */
    public Seat getSeatAt(int row, int col) {
        if (row < 1 || row > rows || col < 1 || col > cols) return null;
        // index: (row-1)*cols + (col-1)
        int idx = (row - 1) * cols + (col - 1);
        return seats.get(idx);
    }

    @Override
    public String toString() {
        return name + " Section (" + rows + "x" + cols + ")";
    }
}