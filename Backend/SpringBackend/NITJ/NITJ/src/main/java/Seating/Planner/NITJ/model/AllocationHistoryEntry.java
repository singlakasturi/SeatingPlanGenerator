package Seating.Planner.NITJ.model;

import java.time.LocalDateTime;
import java.util.Map;

public class AllocationHistoryEntry {

    private int index;

    // 🔑 links history → bookings
    private String allocationId;

    private String date;
    private String timeSlot;

    private LocalDateTime createdAt;

    // optional: whatever you want to show in UI
    private Map<String, Object> payload;

    public AllocationHistoryEntry() {}

    public AllocationHistoryEntry(int index,
                                  String allocationId,
                                  String date,
                                  String timeSlot,
                                  Map<String, Object> payload) {

        this.index = index;
        this.allocationId = allocationId;
        this.date = date;
        this.timeSlot = timeSlot;
        this.payload = payload;
        this.createdAt = LocalDateTime.now();
    }

    // ---------------- Getters / Setters ----------------

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getAllocationId() {
        return allocationId;
    }

    public void setAllocationId(String allocationId) {
        this.allocationId = allocationId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }
}
