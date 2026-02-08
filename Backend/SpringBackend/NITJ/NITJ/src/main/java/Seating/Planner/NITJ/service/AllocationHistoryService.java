package Seating.Planner.NITJ.service;

import Seating.Planner.NITJ.model.AllocationHistoryEntry;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AllocationHistoryService {

    private static final int MAX_HISTORY = 10;
    private final AllocationHistoryEntry[] history = new AllocationHistoryEntry[MAX_HISTORY];
    private int currentIndex = 0;
    private int count = 0;

    /**
     * Store a new allocation result in the circular array
     */
    public int saveAllocation(Map<String, Object> fullPayload) {
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        AllocationHistoryEntry entry = new AllocationHistoryEntry(
                currentIndex,
                timestamp,
                fullPayload
        );

        history[currentIndex] = entry;
        int savedIndex = currentIndex;

        // Move to next position (circular)
        currentIndex = (currentIndex + 1) % MAX_HISTORY;
        if (count < MAX_HISTORY) count++;

        return savedIndex;
    }

    /**
     * Get all non-null history entries
     */
    public List<AllocationHistoryEntry> getAllHistory() {
        List<AllocationHistoryEntry> result = new ArrayList<>();
        for (int i = 0; i < MAX_HISTORY; i++) {
            if (history[i] != null) {
                result.add(history[i]);
            }
        }
        // Sort by timestamp descending (newest first)
        result.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        return result;
    }

    /**
     * Get specific allocation by index
     */
    public AllocationHistoryEntry getByIndex(int index) {
        if (index < 0 || index >= MAX_HISTORY) {
            throw new IllegalArgumentException("Invalid index: " + index);
        }
        AllocationHistoryEntry entry = history[index];
        if (entry == null) {
            throw new IllegalArgumentException("No data found at index: " + index);
        }
        return entry;
    }

    /**
     * Delete allocation at specific index
     */
    public boolean deleteByIndex(int index) {
        if (index < 0 || index >= MAX_HISTORY) {
            return false;
        }
        if (history[index] != null) {
            history[index] = null;
            if (count > 0) count--;
            return true;
        }
        return false;
    }

    /**
     * Get current count of stored allocations
     */
    public int getCount() {
        return count;
    }
}