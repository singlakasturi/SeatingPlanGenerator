package Seating.Planner.NITJ.util;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ObjectMapperUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static <T> T convert(Object source, Class<T> target) {
        return mapper.convertValue(source, target);
    }
}
