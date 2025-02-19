package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LineSecondOrderAlgorithm {

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


    public List<Point> generateEllipse(JsonNode jsonData) {
        System.out.println("sdsds");
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int xc = points.getFirst().getX();
        int yc = points.getFirst().getY();
        int a = jsonData.get("a").asInt();
        int b = jsonData.get("b").asInt();

        int x = 0, y = b;
        int a2 = a * a, b2 = b * b;
        int fa2 = 4 * a2, fb2 = 4 * b2;
        int d = fb2 - a2 * (2 * b - 1);

        while (b2 * x <= a2 * y) {
            addEllipsePoints(points, xc, yc, x, y);
            if (d < 0) {
                d += fb2 * (2 * x + 3);
            } else {
                d += fb2 * (2 * x + 3) + fa2 * (-2 * y + 2);
                y--;
            }
            x++;
        }

        d = (int) (b2 * Math.pow(x + 0.5, 2) + a2 * Math.pow(y - 1, 2) - a2 * b2);

        while (y >= 0) {
            addEllipsePoints(points, xc, yc, x, y);
            if (d > 0) {
                d += fa2 * (-2 * y + 3);
            } else {
                d += fb2 * (2 * x + 2) + fa2 * (-2 * y + 3);
                x++;
            }
            y--;
        }

        return points;
    }

    private void addEllipsePoints(List<Point> points, int xc, int yc, int x, int y) {
        points.add(new Point(xc + x, yc + y));
        points.add(new Point(xc - x, yc + y));
        points.add(new Point(xc + x, yc - y));
        points.add(new Point(xc - x, yc - y));
    }

    public List<Point> generateHyperbola(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int xc = points.getFirst().getX();
        int yc = points.getFirst().getY();
        int a = jsonData.get("a").asInt();
        int b = jsonData.get("b").asInt();
        boolean vertical = jsonData.get("position").asBoolean();
        double step = 0.05;

        if (vertical) {
            for (double y = b; y <= 3 * b; y += step) {
                double x = a * Math.sqrt((y * y / (double) (b * b)) - 1);
                addHyperbolaPoints(points, xc, yc, (int) Math.round(x), (int) Math.round(y), vertical);
            }
        } else {
            for (double x = a; x <= 3 * a; x += step) {
                double y = b * Math.sqrt((x * x / (double) (a * a)) - 1);
                addHyperbolaPoints(points, xc, yc, (int) Math.round(x), (int) Math.round(y), vertical);
            }
        }

        return points;
    }

    private void addHyperbolaPoints(List<Point> points, int xc, int yc, int x, int y, boolean vertical) {
        if (vertical) {
            points.add(new Point(xc + x, yc + y));
            points.add(new Point(xc + x, yc - y));
            points.add(new Point(xc - x, yc + y));
            points.add(new Point(xc - x, yc - y));
        } else {
            points.add(new Point(xc + x, yc + y));
            points.add(new Point(xc - x, yc + y));
            points.add(new Point(xc + x, yc - y));
            points.add(new Point(xc - x, yc - y));
        }
    }

    public List<Point> generateParabola(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int xc = points.getFirst().getX();
        int yc = points.getFirst().getY();
        double a = jsonData.get("a").asDouble();
        double n = jsonData.get("b").asDouble();
        boolean position = jsonData.get("position").asBoolean();

        int yLimit = 300;
        for (int y = 0; y <= yLimit; y++) {
            double x = Math.pow(y / a, 1.0 / n);
            int xPixel = (int) Math.round(x);

            int yPixel = position ? yc - y : yc + y;
            points.add(new Point(xc + xPixel, yPixel));
            points.add(new Point(xc - xPixel, yPixel));
        }

        return points;
    }


}
