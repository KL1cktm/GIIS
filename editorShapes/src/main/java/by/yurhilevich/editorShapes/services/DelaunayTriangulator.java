package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DelaunayTriangulator {

    @Autowired
    private ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public List<Triangle> triangulate(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        return delaunayTriangulation(points);
    }

    private List<Triangle> delaunayTriangulation(List<Point> points) {
        List<Triangle> triangles = new ArrayList<>();

        Set<Point> uniquePoints = new LinkedHashSet<>(points);
        points = new ArrayList<>(uniquePoints);

        if (points.size() < 3) {
            return triangles;
        }

        if (arePointsCollinear(points)) {
            return triangles;
        }

        Triangle superTriangle = createSuperTriangle(points);
        triangles.add(superTriangle);

        for (Point point : points) {
            List<Triangle> badTriangles = new ArrayList<>();

            for (Triangle triangle : triangles) {
                if (isInCircumcircle(triangle, point)) {
                    badTriangles.add(triangle);
                }
            }

            Set<Edge> polygonEdges = new HashSet<>();
            for (Triangle triangle : badTriangles) {
                for (Edge edge : triangle.getEdges()) {
                    boolean shared = badTriangles.stream()
                            .filter(t -> t != triangle)
                            .anyMatch(t -> t.containsEdge(edge));
                    if (!shared) {
                        polygonEdges.add(edge);
                    }
                }
            }

            triangles.removeAll(badTriangles);

            for (Edge edge : polygonEdges) {
                Triangle newTriangle = new Triangle(edge.getP1(), edge.getP2(), point);
                if (!isTriangleDegenerate(newTriangle)) {
                    triangles.add(newTriangle);
                }
            }
        }

        triangles.removeIf(t ->
                t.containsVertex(superTriangle.getA()) ||
                        t.containsVertex(superTriangle.getB()) ||
                        t.containsVertex(superTriangle.getC()));

        return triangles;
    }

    private boolean arePointsCollinear(List<Point> points) {
        if (points.size() < 3) return true;

        Point a = points.get(0);
        Point b = points.get(1);

        for (int i = 2; i < points.size(); i++) {
            Point p = points.get(i);
            long area = (long)(b.getX() - a.getX()) * (p.getY() - a.getY()) -
                    (long)(b.getY() - a.getY()) * (p.getX() - a.getX());
            if (area != 0) {
                return false;
            }
        }
        return true;
    }

    private Triangle createSuperTriangle(List<Point> points) {
        int minX = Integer.MAX_VALUE;
        int minY = Integer.MAX_VALUE;
        int maxX = Integer.MIN_VALUE;
        int maxY = Integer.MIN_VALUE;

        for (Point p : points) {
            minX = Math.min(minX, p.getX());
            minY = Math.min(minY, p.getY());
            maxX = Math.max(maxX, p.getX());
            maxY = Math.max(maxY, p.getY());
        }

        int dx = maxX - minX;
        int dy = maxY - minY;
        int delta = Math.max(dx, dy) * 2;

        Point p1 = new Point(minX - delta, minY - delta);
        Point p2 = new Point(minX + 2 * delta, minY - delta);
        Point p3 = new Point(minX + dx / 2, maxY + delta);

        return new Triangle(p1, p2, p3);
    }

    private boolean isInCircumcircle(Triangle triangle, Point point) {
        Point a = triangle.getA();
        Point b = triangle.getB();
        Point c = triangle.getC();

        long ax = a.getX() - point.getX();
        long ay = a.getY() - point.getY();
        long bx = b.getX() - point.getX();
        long by = b.getY() - point.getY();
        long cx = c.getX() - point.getX();
        long cy = c.getY() - point.getY();

        long det = ax * (by * (cx*cx + cy*cy) - cy * (bx*bx + by*by)) -
                ay * (bx * (cx*cx + cy*cy) - cx * (bx*bx + by*by)) +
                (ax*ax + ay*ay) * (bx * cy - cx * by);

        return det > 0;
    }

    private boolean isTriangleDegenerate(Triangle triangle) {
        Point a = triangle.getA();
        Point b = triangle.getB();
        Point c = triangle.getC();

        long area = (long)(b.getX() - a.getX()) * (c.getY() - a.getY()) -
                (long)(b.getY() - a.getY()) * (c.getX() - a.getX());
        return area == 0;
    }
}