package by.yurhilevich.editorShapes.models;

import java.util.ArrayList;
import java.util.List;

public class Triangle {
    private final Point a;
    private final Point b;
    private final Point c;

    public Triangle(Point a, Point b, Point c) {
        if (a == null || b == null || c == null) {
            throw new IllegalArgumentException("Triangle vertices cannot be null");
        }
        this.a = a;
        this.b = b;
        this.c = c;
    }

    public Point getA() {
        return a;
    }

    public Point getB() {
        return b;
    }

    public Point getC() {
        return c;
    }

    public List<Edge> getEdges() {
        List<Edge> edges = new ArrayList<>();
        edges.add(new Edge(a, b));
        edges.add(new Edge(b, c));
        edges.add(new Edge(c, a));
        return edges;
    }

    public boolean containsEdge(Edge edge) {
        return getEdges().contains(edge);
    }

    public boolean containsVertex(Point point) {
        return a.equals(point) || b.equals(point) || c.equals(point);
    }

    public boolean isDegenerate() {
        long area = (long)(b.getX() - a.getX()) * (c.getY() - a.getY()) -
                (long)(b.getY() - a.getY()) * (c.getX() - a.getX());
        return area == 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Triangle triangle = (Triangle) o;
        return (a.equals(triangle.a) && b.equals(triangle.b) && c.equals(triangle.c)) ||
                (a.equals(triangle.a) && b.equals(triangle.c) && c.equals(triangle.b)) ||
                (a.equals(triangle.b) && b.equals(triangle.a) && c.equals(triangle.c)) ||
                (a.equals(triangle.b) && b.equals(triangle.c) && c.equals(triangle.a)) ||
                (a.equals(triangle.c) && b.equals(triangle.a) && c.equals(triangle.b)) ||
                (a.equals(triangle.c) && b.equals(triangle.b) && c.equals(triangle.a));
    }

    @Override
    public int hashCode() {
        return a.hashCode() + b.hashCode() + c.hashCode();
    }

    @Override
    public String toString() {
        return "Triangle[" + a + ", " + b + ", " + c + "]";
    }
}