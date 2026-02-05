package Seating.Planner.NITJ.model;


import java.util.List;

public class AllocationRequest {

    private String programme;
    private String year;
    private List<String> subjectCode;
    private String date;
    private String time;

    public String getProgramme() { return programme; }
    public void setProgramme(String programme) { this.programme = programme; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public List<String> getSubjectCode() { return subjectCode; }
    public void setSubjectCode(List<String> subjectCode) { this.subjectCode = subjectCode; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
