package Seating.Planner.NITJ.model;

public class SubjectPair {

    private String subjectA;
    private String subjectB;

    // ✅ Required by Jackson
    public SubjectPair() {
    }

    public SubjectPair(String subjectA, String subjectB) {
        this.subjectA = subjectA;
        this.subjectB = subjectB;
    }

    public String getSubjectA() {
        return subjectA;
    }

    public void setSubjectA(String subjectA) {
        this.subjectA = subjectA;
    }

    public String getSubjectB() {
        return subjectB;
    }

    public void setSubjectB(String subjectB) {
        this.subjectB = subjectB;
    }
}
