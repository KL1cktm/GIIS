package by.yurhilevich.editorShapes.models;

public class Matrix4x4 {
    private final double[][] matrix;

    public Matrix4x4(double[][] matrix) {
        if (matrix.length != 4 || matrix[0].length != 4) {
            throw new IllegalArgumentException("Матрица должна быть 4x4.");
        }
        this.matrix = matrix;
    }

    public Point3D multiply(Point3D point) {
        double x = matrix[0][0] * point.getX() + matrix[0][1] * point.getY() + matrix[0][2] * point.getZ() + matrix[0][3];
        double y = matrix[1][0] * point.getX() + matrix[1][1] * point.getY() + matrix[1][2] * point.getZ() + matrix[1][3];
        double z = matrix[2][0] * point.getX() + matrix[2][1] * point.getY() + matrix[2][2] * point.getZ() + matrix[2][3];
        return new Point3D(x, y, z);
    }

    public Point3D multiplyPerspective(Point3D point) {
        double x = matrix[0][0] * point.getX() + matrix[0][1] * point.getY() + matrix[0][2] * point.getZ() + matrix[0][3];
        double y = matrix[1][0] * point.getX() + matrix[1][1] * point.getY() + matrix[1][2] * point.getZ() + matrix[1][3];
        double z = matrix[2][0] * point.getX() + matrix[2][1] * point.getY() + matrix[2][2] * point.getZ() + matrix[2][3];
        double w = matrix[3][0] * point.getX() + matrix[3][1] * point.getY() + matrix[3][2] * point.getZ() + matrix[3][3];

        if (w != 0) {
            x /= w;
            y /= w;
            z /= w;
        }

        return new Point3D(x, y, z);
    }
}
