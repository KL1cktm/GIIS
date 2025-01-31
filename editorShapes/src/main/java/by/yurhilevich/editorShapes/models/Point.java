package by.yurhilevich.editorShapes.models;

import lombok.Data;

@Data
public class Point {
    private int x;
    private int y;
    private double alpha;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public Point(int x, int y, double alpha) {
        this.x = x;
        this.y = y;
        this.alpha = alpha;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public double getAlpha() {
        return alpha;
    }

    public void setAlpha(double alpha) {
        this.alpha = alpha;
    }
}
