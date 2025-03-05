package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Matrix4x4;
import by.yurhilevich.editorShapes.models.Point3D;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class Transformation {

    public List<Point3D> translate(List<Point3D> vertices, double tx, double ty, double tz) {
        List<Point3D> translatedVertices = new ArrayList<>();

        for (Point3D vertex : vertices) {
            double newX = vertex.getX() + tx;
            double newY = vertex.getY() + ty;
            double newZ = vertex.getZ() + tz;

            translatedVertices.add(new Point3D(newX, newY, newZ));
        }

        return translatedVertices;
    }

    public List<Point3D> translate(List<Point3D> vertices, String variable, double a) {
        double tx = 0, ty = 0, tz = 0;
        if (variable.equals("x")) {
            tx = a;
        } else if (variable.equals("y")) {
            ty = a;
        } else if (variable.equals("z")) {
            tz = a;
        }
        List<Point3D> translatedVertices = new ArrayList<>();

        for (Point3D vertex : vertices) {
            double newX = vertex.getX() + tx;
            double newY = vertex.getY() + ty;
            double newZ = vertex.getZ() + tz;

            translatedVertices.add(new Point3D(newX, newY, newZ));
        }
        return translatedVertices;
    }

    public List<Point3D> rotateX(List<Point3D> vertices, double angle) {
        List<Point3D> rotatedVertices = new ArrayList<>();
        double radians = Math.toRadians(angle);
        double cos = Math.cos(radians);
        double sin = Math.sin(radians);

        for (Point3D vertex : vertices) {
            double y = vertex.getY() * cos - vertex.getZ() * sin;
            double z = vertex.getY() * sin + vertex.getZ() * cos;
            rotatedVertices.add(new Point3D(vertex.getX(), y, z));
        }

        return rotatedVertices;
    }

    public List<Point3D> rotateY(List<Point3D> vertices, double angle) {
        List<Point3D> rotatedVertices = new ArrayList<>();
        double radians = Math.toRadians(angle);
        double cos = Math.cos(radians);
        double sin = Math.sin(radians);

        for (Point3D vertex : vertices) {
            double x = vertex.getX() * cos + vertex.getZ() * sin;
            double z = -vertex.getX() * sin + vertex.getZ() * cos;
            rotatedVertices.add(new Point3D(x, vertex.getY(), z));
        }

        return rotatedVertices;
    }

    public List<Point3D> rotateZ(List<Point3D> vertices, double angle) {
        List<Point3D> rotatedVertices = new ArrayList<>();
        double radians = Math.toRadians(angle);
        double cos = Math.cos(radians);
        double sin = Math.sin(radians);

        for (Point3D vertex : vertices) {
            double x = vertex.getX() * cos - vertex.getY() * sin;
            double y = vertex.getX() * sin + vertex.getY() * cos;
            rotatedVertices.add(new Point3D(x, y, vertex.getZ()));
        }

        return rotatedVertices;
    }

    public List<Point3D> rotate(List<Point3D> vertices, String axis, double angle) {
        switch (axis.toLowerCase()) {
            case "x":
                return rotateX(vertices, angle);
            case "y":
                return rotateY(vertices, angle);
            case "z":
                return rotateZ(vertices, angle);
            default:
                throw new IllegalArgumentException("Invalid axis. Use 'x', 'y', or 'z'.");
        }
    }

    private static Matrix4x4 createPerspectiveMatrix(double distance) {
        return new Matrix4x4(new double[][]{
                {1, 0, 0, 0},
                {0, 1, 0, 0},
                {0, 0, 1, 0},
                {0, 0, -1 / distance, 1}
        });
    }

    private static final Matrix4x4 REFLECT_XY_MATRIX = new Matrix4x4(new double[][]{
            {1, 0, 0, 0},
            {0, 1, 0, 0},
            {0, 0, -1, 0},
            {0, 0, 0, 1}
    });

    private static final Matrix4x4 REFLECT_XZ_MATRIX = new Matrix4x4(new double[][]{
            {1, 0, 0, 0},
            {0, -1, 0, 0},
            {0, 0, 1, 0},
            {0, 0, 0, 1}
    });

    private static final Matrix4x4 REFLECT_YZ_MATRIX = new Matrix4x4(new double[][]{
            {-1, 0, 0, 0},
            {0, 1, 0, 0},
            {0, 0, 1, 0},
            {0, 0, 0, 1}
    });

    public List<Point3D> reflectXY(List<Point3D> vertices) {
        return applyTransformation(vertices, REFLECT_XY_MATRIX);
    }

    public List<Point3D> reflectXZ(List<Point3D> vertices) {
        return applyTransformation(vertices, REFLECT_XZ_MATRIX);
    }

    public List<Point3D> reflectYZ(List<Point3D> vertices) {
        return applyTransformation(vertices, REFLECT_YZ_MATRIX);
    }

    public List<Point3D> reflect(List<Point3D> vertices, String plane) {
        switch (plane.toLowerCase()) {
            case "xy":
                return reflectXY(vertices);
            case "xz":
                return reflectXZ(vertices);
            case "yz":
                return reflectYZ(vertices);
            default:
                throw new IllegalArgumentException("Недопустимая плоскость. Используйте 'xy', 'xz' или 'yz'.");
        }
    }

    private List<Point3D> applyTransformation(List<Point3D> vertices, Matrix4x4 matrix) {
        List<Point3D> transformedVertices = new ArrayList<>();
        for (Point3D vertex : vertices) {
            transformedVertices.add(matrix.multiply(vertex));
        }
        return transformedVertices;
    }

    public List<Point3D> perspective(List<Point3D> vertices, double distance) {
        Matrix4x4 perspectiveMatrix = createPerspectiveMatrix(distance);
        List<Point3D> projectedVertices = new ArrayList<>();

        for (Point3D vertex : vertices) {
            projectedVertices.add(perspectiveMatrix.multiplyPerspective(vertex));
        }

        return projectedVertices;
    }
}
