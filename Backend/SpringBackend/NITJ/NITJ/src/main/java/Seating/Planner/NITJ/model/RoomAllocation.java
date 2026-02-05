package Seating.Planner.NITJ.model;

import java.util.List;

public class RoomAllocation {

    private String roomCode;
    private Room.RoomType type;
    private List<String> subjectPair;
    private List<SeatAssignment> allocations;

    // REQUIRED BY JACKSON
    public RoomAllocation() {
    }

    public RoomAllocation(
            String roomCode,
            Room.RoomType type,
            List<String> subjectPair,
            List<SeatAssignment> allocations
    ) {
        this.roomCode = roomCode;
        this.type = type;
        this.subjectPair = subjectPair;
        this.allocations = allocations;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public Room.RoomType getType() {
        return type;
    }

    public List<String> getSubjectPair() {
        return subjectPair;
    }

    public List<SeatAssignment> getAllocations() {
        return allocations;
    }

    // REQUIRED SETTERS
    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public void setType(Room.RoomType type) {
        this.type = type;
    }

    public void setSubjectPair(List<String> subjectPair) {
        this.subjectPair = subjectPair;
    }

    public void setAllocations(List<SeatAssignment> allocations) {
        this.allocations = allocations;
    }
}
