package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import by.yurhilevich.editorShapes.models.Vector;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

@Service
public class PolygonService {

    @Autowired
    ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public boolean isConvex(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int n = points.size();
        if (n < 3) {
            return false;
        }

        int previousOrientation = 0;
        boolean isConvex = true;

        for (int i = 0; i < n; i++) {
            Point p0 = points.get(i);
            Point p1 = points.get((i + 1) % n);
            Point p2 = points.get((i + 2) % n);

            int orientation = getOrientation(p0, p1, p2);

            if (orientation == 0) {
                continue;
            }
            if (previousOrientation == 0) {
                previousOrientation = orientation;
            } else if (orientation != previousOrientation) {
                isConvex = false;
                break;
            }
        }
        return isConvex;
    }

    private int getOrientation(Point p0, Point p1, Point p2) {
        int value = (p1.getX() - p0.getX()) * (p2.getY() - p1.getY()) -
                (p1.getY() - p0.getY()) * (p2.getX() - p1.getX());

        if (value == 0) {
            return 0;
        }
        return (value > 0) ? 1 : -1;
    }

    public List<Vector> findInnerNormals(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        List<Vector> normals = new ArrayList<>();

        int n = points.size();
        for (int i = 0; i < n; i++) {
            Point p1 = points.get(i);
            Point p2 = points.get((i + 1) % n);

            double dx = p2.getX() - p1.getX();
            double dy = p2.getY() - p1.getY();

            double nx = -dy;
            double ny = dx;

            double length = Math.sqrt(nx * nx + ny * ny);
            if (length > 0) {
                nx /= length;
                ny /= length;
            }

            normals.add(new Vector(nx, ny));
        }

        return normals;
    }

    public List<Point> grahamScan(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        if (points.size() < 3) {
            return points;
        }

        Point start = points.get(0);
        for (Point p : points) {
            if (p.getY() < start.getY() || (p.getY() == start.getY() && p.getX() < start.getX())) {
                start = p;
            }
        }

        final Point finalStart = start;

        points.sort((p1, p2) -> {
            double angle1 = Math.atan2(p1.getY() - finalStart.getY(), p1.getX() - finalStart.getX());
            double angle2 = Math.atan2(p2.getY() - finalStart.getY(), p2.getX() - finalStart.getX());
            return Double.compare(angle1, angle2);
        });

        Stack<Point> hull = new Stack<>();
        hull.push(points.get(0));
        hull.push(points.get(1));

        for (int i = 2; i < points.size(); i++) {
            Point top = hull.pop();
            while (ccw(hull.peek(), top, points.get(i)) <= 0) {
                top = hull.pop();
            }
            hull.push(top);
            hull.push(points.get(i));
        }

        return new ArrayList<>(hull);
    }

    public List<Point> jarvisMarch(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        if (points.size() < 3) {
            return points;
        }

        List<Point> hull = new ArrayList<>();

        Point start = points.get(0);
        for (Point p : points) {
            if (p.getX() < start.getX()) {
                start = p;
            }
        }

        Point current = start;
        do {
            hull.add(current);
            Point next = points.get(0);

            for (Point p : points) {
                if (p == current) continue;
                int cross = ccw(current, next, p);
                if (next == current || cross == -1 || (cross == 0 && distance(current, p) > distance(current, next))) {
                    next = p;
                }
            }
            current = next;
        } while (current != start);

        return hull;
    }

    private int ccw(Point a, Point b, Point c) {
        int area = (b.getX() - a.getX()) * (c.getY() - a.getY()) - (b.getY() - a.getY()) * (c.getX() - a.getX());
        if (area < 0) return -1;
        else if (area > 0) return 1;
        else return 0;
    }

    private double distance(Point a, Point b) {
        return Math.sqrt(Math.pow(b.getX() - a.getX(), 2) + Math.pow(b.getY() - a.getY(), 2));
    }

    public List<Point> parseFromJson(JsonNode jsonData) {
        List<Point> pointsList = new ArrayList<>();
        if (jsonData.has("lines")) {
            for (JsonNode line : jsonData.get("lines")) {
                if (line.has("points")) {
                    for (JsonNode point : line.get("points")) {
                        int x = point.get("x").asInt();
                        int y = point.get("y").asInt();
                        pointsList.add(new Point(x, y));
                    }
                }
            }
        }

        return pointsList;
    }

    public List<Point> intersection(JsonNode jsonData) {
        List<Point> pointsPolygon = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        List<Point> pointsLine = parseFromJson(jsonData);
        List<Point> intersections = new ArrayList<>();
        for (int i = 0; i < pointsPolygon.size(); i++) {
            Point A = pointsPolygon.get(i);
            Point B = pointsPolygon.get((i + 1) % pointsPolygon.size());
            for (int j = 0; j < pointsLine.size() - 1; j++) {
                Point C = pointsLine.get(j);
                Point D = pointsLine.get(j + 1);
                Point intersection = findIntersection(A, B, C, D);
                if (intersection != null) {
                    intersections.add(intersection);
                }
            }
        }

        return intersections;
    }

    private Point findIntersection(Point A, Point B, Point C, Point D) {
        int x1 = A.getX(), y1 = A.getY();
        int x2 = B.getX(), y2 = B.getY();
        int x3 = C.getX(), y3 = C.getY();
        int x4 = D.getX(), y4 = D.getY();
        int denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator == 0) {
            return null;
        }
        double t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / (double) denominator;
        double u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / (double) denominator;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            int intersectionX = (int) Math.round(x1 + t * (x2 - x1));
            int intersectionY = (int) Math.round(y1 + t * (y2 - y1));
            return new Point(intersectionX, intersectionY);
        }
        return null;
    }
}
