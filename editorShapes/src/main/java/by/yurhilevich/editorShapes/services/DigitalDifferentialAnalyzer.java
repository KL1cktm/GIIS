package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DigitalDifferentialAnalyzer {
    @Autowired
    ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public List<Point> processing(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        double dx = points.get(1).getX() - points.get(0).getX();
        double dy = points.get(1).getY() - points.get(0).getY();
        int length = (int)Math.max(Math.abs(dx),Math.abs(dy));
        dx = dx/length;
        dy = dy/length;
        double x =  points.get(0).getX() + 0.5*Math.signum(dx);
        double y =  points.get(0).getY() + 0.5*Math.signum(dy);
        points.add(new Point((int)x, (int)y));
        int i = 0;
        while (i < length) {
            x = x + dx;
            y = y + dy;
            points.add(new Point((int)x, (int)y));
            i++;
        }
        return points;
    }
}
