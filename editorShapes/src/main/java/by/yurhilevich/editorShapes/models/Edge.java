package by.yurhilevich.editorShapes.models;


public class Edge {
    private final Point p1;
    private final Point p2;

    public Edge(Point p1, Point p2) {
        if (p1 == null || p2 == null) {
            throw new IllegalArgumentException("Edge points cannot be null");
        }
        this.p1 = p1;
        this.p2 = p2;
    }

    public Point getP1() {
        return p1;
    }

    public Point getP2() {
        return p2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge edge = (Edge) o;
        return (p1.equals(edge.p1) && p2.equals(edge.p2)) ||
                (p1.equals(edge.p2) && p2.equals(edge.p1));
    }

    @Override
    public int hashCode() {
        return p1.hashCode() + p2.hashCode();
    }

    @Override
    public String toString() {
        return "Edge[" + p1 + " - " + p2 + "]";
    }
}