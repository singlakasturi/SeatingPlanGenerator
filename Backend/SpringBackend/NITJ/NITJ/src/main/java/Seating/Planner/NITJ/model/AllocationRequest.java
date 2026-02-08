package Seating.Planner.NITJ.model;

import java.util.List;

public class AllocationRequest {

    private String programme;
    private String year;
    private String date;
    private String time;

    // 🔑 ALWAYS present
    private List<String> subjects;

    // 🔑 Optional (empty = single-subject mode)
    private List<SubjectPair> subjectPairs;

    public String getProgramme() {
        return programme;
    }

    public void setProgramme(String programme) {
        this.programme = programme;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public List<SubjectPair> getSubjectPairs() {
        return subjectPairs;
    }

    public void setSubjectPairs(List<SubjectPair> subjectPairs) {
        this.subjectPairs = subjectPairs;
    }
}
