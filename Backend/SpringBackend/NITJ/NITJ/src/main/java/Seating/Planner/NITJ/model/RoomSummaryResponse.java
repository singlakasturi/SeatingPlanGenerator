package Seating.Planner.NITJ.model;


import java.util.List;

public class RoomSummaryResponse {

    private int totalRooms;
    private int bookedRooms;
    private int availableRooms;
    private List<String> bookedRoomCodes;

    public RoomSummaryResponse(int totalRooms, int bookedRooms, int availableRooms, List<String> bookedRoomCodes) {
        this.totalRooms = totalRooms;
        this.bookedRooms = bookedRooms;
        this.availableRooms = availableRooms;
        this.bookedRoomCodes = bookedRoomCodes;
    }

    public int getTotalRooms() { return totalRooms; }
    public int getBookedRooms() { return bookedRooms; }
    public int getAvailableRooms() { return availableRooms; }
    public List<String> getBookedRoomCodes() { return bookedRoomCodes; }
}
