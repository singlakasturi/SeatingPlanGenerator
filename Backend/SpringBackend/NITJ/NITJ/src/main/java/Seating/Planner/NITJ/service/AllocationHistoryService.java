package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.AllocationHistoryEntry;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AllocationHistoryService {

    private static final int MAX_HISTORY = 10;

    // Circular buffer
    private final AllocationHistoryEntry[] history =
            new AllocationHistoryEntry[MAX_HISTORY];

    private int currentIndex = 0;
    private int count = 0;

    /**
     * Save a new allocation entry
     */
    public int saveAllocation(String allocationId,
                              String date,
                              String timeSlot,
                              Map<String, Object> payload) {

        AllocationHistoryEntry entry = new AllocationHistoryEntry(
                currentIndex,
                allocationId,
                date,
                timeSlot,
                payload
        );

        history[currentIndex] = entry;
        int savedIndex = currentIndex;

        currentIndex = (currentIndex + 1) % MAX_HISTORY;
        if (count < MAX_HISTORY) count++;

        return savedIndex;
    }

    /**
     * Get all stored history entries (newest first)
     */
    public List<AllocationHistoryEntry> getAllHistory() {

        List<AllocationHistoryEntry> result = new ArrayList<>();

        for (AllocationHistoryEntry entry : history) {
            if (entry != null) {
                result.add(entry);
            }
        }

        result.sort(Comparator.comparing(
                AllocationHistoryEntry::getCreatedAt
        ).reversed());

        return result;
    }

    /**
     * Get all history for a specific date+time
     */
    public List<AllocationHistoryEntry> getHistoryFor(
            String date, String timeSlot) {

        List<AllocationHistoryEntry> result = new ArrayList<>();

        for (AllocationHistoryEntry entry : history) {
            if (entry != null
                    && entry.getDate().equals(date)
                    && entry.getTimeSlot().equals(timeSlot)) {
                result.add(entry);
            }
        }

        result.sort(Comparator.comparing(
                AllocationHistoryEntry::getCreatedAt
        ).reversed());

        return result;
    }

    /**
     * Remove the MOST RECENT allocation entry
     * for a given date+time (used during reallocation)
     */
    public Optional<AllocationHistoryEntry> removeLastFor(
            String date, String timeSlot) {

        AllocationHistoryEntry latest = null;
        int latestIndex = -1;

        for (int i = 0; i < MAX_HISTORY; i++) {
            AllocationHistoryEntry entry = history[i];
            if (entry != null
                    && entry.getDate().equals(date)
                    && entry.getTimeSlot().equals(timeSlot)) {

                if (latest == null ||
                        entry.getCreatedAt().isAfter(latest.getCreatedAt())) {
                    latest = entry;
                    latestIndex = i;
                }
            }
        }

        if (latestIndex != -1) {
            history[latestIndex] = null;
            count--;
            return Optional.of(latest);
        }

        return Optional.empty();
    }

    /**
     * Get allocation history by index (UI/debug)
     */
    public AllocationHistoryEntry getByIndex(int index) {

        if (index < 0 || index >= MAX_HISTORY) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }

        AllocationHistoryEntry entry = history[index];
        if (entry == null) {
            throw new IllegalArgumentException(
                    "No allocation found at index: " + index
            );
        }

        return entry;
    }

    public int getCount() {
        return count;
    }

    public boolean removeByIndex(int index) {
        if (index < 0 || index >= MAX_HISTORY) return false;
        if (history[index] == null) return false;

        history[index] = null;
        count--;
        return true;
    }

}