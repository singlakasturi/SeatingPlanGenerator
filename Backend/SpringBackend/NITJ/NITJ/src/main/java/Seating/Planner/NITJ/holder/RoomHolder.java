package Seating.Planner.NITJ.holder;


import Seating.Planner.NITJ.model.Room;
import org.springframework.stereotype.Component;



import java.util.ArrayList;
import java.util.List;

@Component
public class RoomHolder {

    private static final List<Room> masterRooms = new ArrayList<>();

    public RoomHolder() { loadDefaultRooms(); }

    private void loadDefaultRooms() {
        for (int i = 101; i <= 103; i++) masterRooms.add(new Room("LT-" + i, Room.RoomType.LT));
        for (int floor = 2; floor <= 4; floor++)
            for (int room = 1; room <= 4; room++)
                masterRooms.add(new Room("LT-" + floor + "0" + room, Room.RoomType.LT));
        for (int block = 0; block <= 7; block++)
            for (int r = 0; r <= 2; r++)
                masterRooms.add(new Room("ALT-" + block + "-" + r, Room.RoomType.ALT));
    }

    public List<Room> getAllRooms() { return masterRooms; }
}
