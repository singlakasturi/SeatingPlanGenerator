package Seating.Planner.NITJ.model;

import java.util.List;


public class AllocationResult {

    private String date;
    private String time;
    private List<RoomAllocation> rooms;

    public AllocationResult(String date, String time, List<RoomAllocation> rooms) {
        this.date = date;
        this.time = time;
        this.rooms = rooms;
    }

    public String getDate() { return date; }
    public String getTime() { return time; }
    public List<RoomAllocation> getRooms() { return rooms; }
}
