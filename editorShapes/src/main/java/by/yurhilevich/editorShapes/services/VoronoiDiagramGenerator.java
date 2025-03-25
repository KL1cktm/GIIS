package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VoronoiDiagramGenerator {

    @Autowired
    private DelaunayTriangulator delaunayTriangulator;

    @Autowired
    private ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public Map<Point, List<Point>> generateVoronoiDiagram(JsonNode jsonData) {
        List<Point> sites = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        List<Triangle> triangles = delaunayTriangulator.triangulate(jsonData);

        return buildVoronoiDiagram(sites, triangles);
    }

    private Map<Point, List<Point>> buildVoronoiDiagram(List<Point> sites, List<Triangle> triangles) {
        Map<Point, List<Point>> voronoiDiagram = new HashMap<>();

        Map<Point, List<Triangle>> siteToTriangles = new HashMap<>();
        for (Point site : sites) {
            siteToTriangles.put(site, new ArrayList<>());
        }

        for (Triangle triangle : triangles) {
            Point circumcenter = calculateCircumcenter(triangle);
            for (Point vertex : Arrays.asList(triangle.getA(), triangle.getB(), triangle.getC())) {
                siteToTriangles.get(vertex).add(triangle);
            }
        }

        for (Map.Entry<Point, List<Triangle>> entry : siteToTriangles.entrySet()) {
            Point site = entry.getKey();
            List<Triangle> adjacentTriangles = entry.getValue();

            List<Point> voronoiCell = new ArrayList<>();

            for (Triangle triangle : adjacentTriangles) {
                voronoiCell.add(calculateCircumcenter(triangle));
            }

            voronoiCell.sort((p1, p2) -> {
                double angle1 = Math.atan2(p1.getY() - site.getY(), p1.getX() - site.getX());
                double angle2 = Math.atan2(p2.getY() - site.getY(), p2.getX() - site.getX());
                return Double.compare(angle1, angle2);
            });

            voronoiDiagram.put(site, voronoiCell);
        }

        return voronoiDiagram;
    }

    private Point calculateCircumcenter(Triangle triangle) {
        Point a = triangle.getA();
        Point b = triangle.getB();
        Point c = triangle.getC();

        Point midAB = new Point((a.getX() + b.getX()) / 2, (a.getY() + b.getY()) / 2);
        Point midBC = new Point((b.getX() + c.getX()) / 2, (b.getY() + c.getY()) / 2);

        double slopeAB = (b.getX() - a.getX()) != 0 ?
                (double)(b.getY() - a.getY()) / (b.getX() - a.getX()) : Double.POSITIVE_INFINITY;
        double slopeBC = (c.getX() - b.getX()) != 0 ?
                (double)(c.getY() - b.getY()) / (c.getX() - b.getX()) : Double.POSITIVE_INFINITY;

        double perpSlopeAB = (slopeAB != 0) ? -1.0 / slopeAB : Double.POSITIVE_INFINITY;
        double perpSlopeBC = (slopeBC != 0) ? -1.0 / slopeBC : Double.POSITIVE_INFINITY;

        int x, y;
        if (Double.isInfinite(perpSlopeAB)) {
            x = midAB.getX();
            y = (int)(perpSlopeBC * (x - midBC.getX()) + midBC.getY());
        } else if (Double.isInfinite(perpSlopeBC)) {
            x = midBC.getX();
            y = (int)(perpSlopeAB * (x - midAB.getX()) + midAB.getY());
        } else {
            x = (int)((midBC.getY() - midAB.getY() + perpSlopeAB * midAB.getX() - perpSlopeBC * midBC.getX()) /
                    (perpSlopeAB - perpSlopeBC));
            y = (int)(perpSlopeAB * (x - midAB.getX()) + midAB.getY());
        }

        return new Point(x, y);
    }

    public List<Edge> getVoronoiEdges(Map<Point, List<Point>> voronoiDiagram) {
        List<Edge> edges = new ArrayList<>();

        for (List<Point> cell : voronoiDiagram.values()) {
            if (cell.size() < 2) continue;

            for (int i = 0; i < cell.size(); i++) {
                Point p1 = cell.get(i);
                Point p2 = cell.get((i + 1) % cell.size());
                edges.add(new Edge(p1, p2));
            }
        }

        return edges;
    }
}