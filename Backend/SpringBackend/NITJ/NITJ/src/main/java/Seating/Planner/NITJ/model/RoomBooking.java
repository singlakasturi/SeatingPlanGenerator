package Seating.Planner.NITJ.model;
import java.util.List;

public class RoomBooking {

    private String roomCode;
    private String date;
    private String timeSlot;
    private List<String> subjects;

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
