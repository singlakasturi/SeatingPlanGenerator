package Seating.Planner.NITJ.model;

public class SeatAssignment {

    private String seatId;
    private String rollNo;
    private String subjectCode;
    private String note;  // ✅ ADD THIS FIELD TO FIX ISSUE 1

    // REQUIRED BY JACKSON
    public SeatAssignment() {
    }

    public SeatAssignment(String seatId, String rollNo, String subjectCode) {
        this.seatId = seatId;
        this.rollNo = rollNo;
        this.subjectCode = subjectCode;
        this.note = "";  // ✅ DEFAULT EMPTY STRING
    }

    // ✅ OVERLOADED CONSTRUCTOR WITH NOTE
    public SeatAssignment(String seatId, String rollNo, String subjectCode, String note) {
        this.seatId = seatId;
        this.rollNo = rollNo;
        this.subjectCode = subjectCode;
        this.note = note;
    }

    public String getSeatId() {
        return seatId;
    }

    public String getRollNo() {
        return rollNo;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    // ✅ ADD NOTE GETTER
    public String getNote() {
        return note;
    }

    // REQUIRED SETTERS
    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    // ✅ ADD NOTE SETTER
    public void setNote(String note) {
        this.note = note;
    }
}
