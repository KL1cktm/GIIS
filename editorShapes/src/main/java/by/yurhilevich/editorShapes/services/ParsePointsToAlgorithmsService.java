package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ParsePointsToAlgorithmsService {
    public List<Point> parseFromJson(JsonNode jsonData) {
        List<Point> pointsList = new ArrayList<>();
        for (JsonNode point : jsonData.get("points")) {
            int x = point.get("x").asInt();
            int y = point.get("y").asInt();
            pointsList.add(new Point(x,y));
            System.out.println("Point: x=" + x + ", y=" + y);
        }
        return pointsList;
    }
}
