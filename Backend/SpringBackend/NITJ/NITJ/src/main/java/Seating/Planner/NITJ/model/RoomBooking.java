package Seating.Planner.NITJ.model;
import java.time.LocalDateTime;
import java.util.List;

public class RoomBooking {

    private String roomCode;
    private String date;
    private String timeSlot;
    private List<String> subjects;
    private String allocationId;
    private LocalDateTime createdAt;

    public RoomBooking(String roomCode, String date, String timeSlot, List<String> subjects, String allocationId, LocalDateTime createdAt) {
        this.roomCode = roomCode;
        this.date = date;
        this.timeSlot = timeSlot;
        this.subjects = subjects;
        this.allocationId = allocationId;
        this.createdAt = createdAt;
    }

    public RoomBooking(String allocationId, String roomCode, String date, String timeSlot, List<String> subjects) {
        this.roomCode = roomCode;
        this.date = date;
        this.timeSlot = timeSlot;
        this.subjects = subjects;
        this.allocationId = allocationId;
        this.createdAt = LocalDateTime.now();
    }

    public RoomBooking(String roomCode, String date, String timeSlot, List<String> subjects) {
        this.roomCode = roomCode;
        this.date = date;
        this.timeSlot = timeSlot;
        this.subjects = subjects;
    }

    public String getRoomCode() { return roomCode; }
    public String getDate() { return date; }
    public String getTimeSlot() { return timeSlot; }
    public List<String> getSubjects() { return subjects; }
    public String getAllocationId() { return allocationId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "RoomBooking{" +
                "room='" + roomCode + '\'' +
                ", date='" + date + '\'' +
                ", time='" + timeSlot + '\'' +
                ", subjects=" + subjects +
                '}';
    }
}