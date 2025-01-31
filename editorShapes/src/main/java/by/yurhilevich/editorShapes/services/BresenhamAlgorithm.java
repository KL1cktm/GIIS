package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class BresenhamAlgorithm {
    @Autowired
    ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public List<Point> drawLine(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int x0 = points.get(0).getX();
        int y0 = points.get(0).getY();
        int x1 = points.get(1).getX();
        int y1 = points.get(1).getY();

        int dx = Math.abs(x1 - x0);
        int dy = Math.abs(y1 - y0);
        int sx = (x0 < x1) ? 1 : -1;
        int sy = (y0 < y1) ? 1 : -1;
        boolean steep = (dy > dx);

        if (steep) {
            int temp = x0;
            x0 = y0;
            y0 = temp;
            temp = x1;
            x1 = y1;
            y1 = temp;
            dx = Math.abs(x1 - x0);
            dy = Math.abs(y1 - y0);
            sx = (x0 < x1) ? 1 : -1;
            sy = (y0 < y1) ? 1 : -1;
        }

        int err = dx / 2;

        while (x0 != x1) {
            if (steep) {
                points.add(new Point(y0, x0));
            } else {
                points.add(new Point(x0, y0));
            }
            err -= dy;
            if (err < 0) {
                y0 += sy;
                err += dx;
            }
            x0 += sx;
        }

        if (steep) {
            points.add(new Point(y1, x1));
        } else {
            points.add(new Point(x1, y1));
        }

        return points;
    }
}
