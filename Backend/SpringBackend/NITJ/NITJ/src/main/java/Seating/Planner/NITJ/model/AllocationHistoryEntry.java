package Seating.Planner.NITJ.model;

import java.util.Map;

public class AllocationHistoryEntry {

    private int index;
    private String timestamp;
    private Map<String, Object> payload;

    public AllocationHistoryEntry() {}

    public AllocationHistoryEntry(int index, String timestamp, Map<String, Object> payload) {
        this.index = index;
        this.timestamp = timestamp;
        this.payload = payload;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }
}