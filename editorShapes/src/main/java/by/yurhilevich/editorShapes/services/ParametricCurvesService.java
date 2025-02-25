package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ParametricCurvesService {

    @Autowired
    ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public List<Point> generateHermiteCurve(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);

        if (points.size() != 4) {
            throw new IllegalArgumentException("Для построения кривой Эрмита требуется ровно 4 точки.");
        }
        Point p0 = points.get(0);
        Point p1 = points.get(1);
        Point t0 = points.get(2);
        Point t1 = points.get(3);

        List<Point> hermiteCurve = new ArrayList<>();
        int numPoints = 1000;

        for (int i = 0; i <= numPoints; i++) {
            double t = (double) i / numPoints;
            Point interpolatedPoint = hermiteInterpolate(p0, p1, t0, t1, t);
            hermiteCurve.add(interpolatedPoint);
        }

        return hermiteCurve;
    }

    private Point hermiteInterpolate(Point p0, Point p1, Point t0, Point t1, double t) {
        double t2 = t * t;
        double t3 = t2 * t;

        double h00 = 2 * t3 - 3 * t2 + 1;
        double h10 = t3 - 2 * t2 + t;
        double h01 = -2 * t3 + 3 * t2;
        double h11 = t3 - t2;

        int x = (int) Math.round(h00 * p0.getX() + h10 * t0.getX() + h01 * p1.getX() + h11 * t1.getX());
        int y = (int) Math.round(h00 * p0.getY() + h10 * t0.getY() + h01 * p1.getY() + h11 * t1.getY());

        return new Point(x, y);
    }

    public List<Point> generateBezierCurve(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        Point P0 = points.get(0);
        Point P1 = points.get(1);
        Point P2 = points.get(2);
        Point P3 = points.get(3);
        int n = 10000;
        List<Point> curvePoints = new ArrayList<>();

        for (int i = 0; i <= n; i++) {
            double t = (double) i / n;
            double b0 = Math.pow(1 - t, 3);
            double b1 = 3 * t * Math.pow(1 - t, 2);
            double b2 = 3 * Math.pow(t, 2) * (1 - t);
            double b3 = Math.pow(t, 3);

            double x = b0 * P0.getX() + b1 * P1.getX() + b2 * P2.getX() + b3 * P3.getX();
            double y = b0 * P0.getY() + b1 * P1.getY() + b2 * P2.getY() + b3 * P3.getY();

            curvePoints.add(new Point((int) Math.round(x), (int) Math.round(y)));
        }
        return curvePoints;
    }

    public List<Point> generateBSplineCurve(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        List<Point> curvePoints = new ArrayList<>();
        int n = 10000;

        int degree = jsonData.get("degree").asInt();
        double[] knotVector = generateKnotVector(points.size(), degree);

        for (int i = 0; i <= n; i++) {
            double t = (double) i / n;
            Point curvePoint = evaluateBSpline(t, points, knotVector, degree);
            curvePoints.add(curvePoint);
        }

        return curvePoints;
    }

    private double[] generateKnotVector(int numControlPoints, int degree) {
        int m = numControlPoints + degree + 1;
        double[] knotVector = new double[m];

        for (int i = 0; i < m; i++) {
            if (i <= degree) {
                knotVector[i] = 0;
            } else if (i >= numControlPoints) {
                knotVector[i] = 1;
            } else {
                knotVector[i] = (double) (i - degree) / (numControlPoints - degree);
            }
        }

        return knotVector;
    }

    private Point evaluateBSpline(double t, List<Point> points, double[] knotVector, int degree) {
        double x = 0, y = 0;

        for (int i = 0; i < points.size(); i++) {
            double basis = basisFunction(i, degree, t, knotVector);
            x += basis * points.get(i).getX();
            y += basis * points.get(i).getY();
        }

        return new Point((int) Math.round(x), (int) Math.round(y));
    }

    private double basisFunction(int i, int degree, double t, double[] knotVector) {
        if (degree == 0) {
            return (knotVector[i] <= t && t < knotVector[i + 1]) ? 1 : 0;
        } else {
            double term1 = 0, term2 = 0;

            double denominator1 = knotVector[i + degree] - knotVector[i];
            if (denominator1 != 0) {
                term1 = ((t - knotVector[i]) / denominator1) * basisFunction(i, degree - 1, t, knotVector);
            }

            double denominator2 = knotVector[i + degree + 1] - knotVector[i + 1];
            if (denominator2 != 0) {
                term2 = ((knotVector[i + degree + 1] - t) / denominator2) * basisFunction(i + 1, degree - 1, t, knotVector);
            }

            return term1 + term2;
        }
    }
}

