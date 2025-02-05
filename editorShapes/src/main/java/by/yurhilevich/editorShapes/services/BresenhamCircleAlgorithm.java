package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BresenhamCircleAlgorithm {

    @Autowired
    ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public List<Point> generateCircle(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int xc = points.getFirst().getX();
        int yc = points.getFirst().getY();
        int r = jsonData.get("radius").asInt();
        int x = 0, y = r;
        int d = 3 - 2 * r;

        while (x <= y) {
            addCirclePoints(points, xc, yc, x, y);
            if (d < 0) {
                d += 4 * x + 6;
            } else {
                d += 4 * (x - y) + 10;
                y--;
            }
            x++;
        }
        return points;
    }

    private void addCirclePoints(List<Point> points, int xc, int yc, int x, int y) {
        points.add(new Point(xc + x, yc + y));
        points.add(new Point(xc - x, yc + y));
        points.add(new Point(xc + x, yc - y));
        points.add(new Point(xc - x, yc - y));
        points.add(new Point(xc + y, yc + x));
        points.add(new Point(xc - y, yc + x));
        points.add(new Point(xc + y, yc - x));
        points.add(new Point(xc - y, yc - x));
    }
}
