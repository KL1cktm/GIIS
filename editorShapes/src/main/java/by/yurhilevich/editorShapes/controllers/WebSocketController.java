package by.yurhilevich.editorShapes.controllers;

import by.yurhilevich.editorShapes.models.Point;
import by.yurhilevich.editorShapes.models.Point3D;
import by.yurhilevich.editorShapes.services.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;


@Controller
public class WebSocketController {

    private SimpMessagingTemplate messagingTemplate;
    private final WuLineAlgorithm wuLineAlgorithm;
    private final DigitalDifferentialAnalyzer digitalDifferentialAnalyzer;
    private final BresenhamAlgorithm bresenhamAlgorithm;
    private final LineSecondOrderAlgorithm lineSecondOrderAlgorithm;
    private final ParametricCurvesService parametricCurvesService;
    private final Transformation transformation;
    private List<Point3D> vertices;
    private double angleX = 0;
    private double angleY = 0;
    private double angleZ = 0;
    private double distance = 100;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, WuLineAlgorithm wuLineAlgorithm,
                               DigitalDifferentialAnalyzer numericDiffAnalyzer, BresenhamAlgorithm bresenhamAlgorithm,
                               LineSecondOrderAlgorithm lineSecondOrderAlgorithm, ParametricCurvesService parametricCurvesService, Transformation transformation) {
        this.messagingTemplate = messagingTemplate;
        this.wuLineAlgorithm = wuLineAlgorithm;
        this.digitalDifferentialAnalyzer = numericDiffAnalyzer;
        this.bresenhamAlgorithm = bresenhamAlgorithm;
        this.lineSecondOrderAlgorithm = lineSecondOrderAlgorithm;
        this.parametricCurvesService = parametricCurvesService;
        this.transformation = transformation;
    }

    @MessageMapping("/draw")
    @SendTo("/topic/line")
    public List<Point> receivePoints(@RequestBody JsonNode jsonData) {
        System.out.println("websocket correct work");
        List<Point> result;
        String tool = jsonData.get("tool").asText();
        System.out.println("Selected tool: " + tool);

        System.out.println("Selected algorithm: " + jsonData.get("alg").asText());
        if (jsonData.get("alg").asText().equals("DDA")) {
            result = digitalDifferentialAnalyzer.processing(jsonData);
        } else if (jsonData.get("alg").asText().equals("Bresenham")) {
            result = bresenhamAlgorithm.drawLine(jsonData);
        } else {
            result = wuLineAlgorithm.drawLine(jsonData);
        }
        return result;
    }

    @MessageMapping("/drawSecondLineOrder")
    @SendTo("/topic/secondLineOrder")
    public List<Point> receivePointsToSecondLine(@RequestBody JsonNode jsonData) {
        System.out.println("websocket2 correct work");
        List<Point> result = new ArrayList<>();
        System.out.println(jsonData.get("figure").asText());
        System.out.println(jsonData.get("figure").asText().equals("Circle"));
        if (jsonData.get("figure").asText().equals("Circle")) {
            result = lineSecondOrderAlgorithm.generateCircle(jsonData);
            result.remove(0);
        } else if (jsonData.get("figure").asText().equals("Ellipse")) {
            result = lineSecondOrderAlgorithm.generateEllipse(jsonData);
            result.remove(0);
        } else if (jsonData.get("figure").asText().equals("Hyperbola")) {
            result = lineSecondOrderAlgorithm.generateHyperbola(jsonData);
            result.remove(0);
        } else {
            result = lineSecondOrderAlgorithm.generateParabola(jsonData);
            result.remove(0);
        }
        return result;
    }

    @MessageMapping("/drawCurveLineOrder")
    @SendTo("/topic/curveLine")
    public List<Point> receivePointsToCurveLine(@RequestBody JsonNode jsonData) {
        System.out.println("websocket3 correct work");
        List<Point> result = new ArrayList<>();
        System.out.println(jsonData.get("figure").asText());
        if (jsonData.get("figure").asText().equals("Hermite")) {
            result = parametricCurvesService.generateHermiteCurve(jsonData);
        } else if (jsonData.get("figure").asText().equals("B-spline")) {
            result = parametricCurvesService.generateBSplineCurve(jsonData);
        } else {
            result = parametricCurvesService.generateBezierCurve(jsonData);
        }
        for (Point p : result) {
            System.out.println(p.getX() + " " + p.getY());
        }
        return result;
    }

    @MessageMapping("/3dMode")
    @SendTo("/topic/3dMode")
    public List<Point3D> receivePointsTo3dMode(@RequestBody JsonNode jsonData) {
        System.out.println("websocket4 correct work");
        List<Point3D> result = new ArrayList<>();
        System.out.println(jsonData.get("method").asText());
        if (jsonData.get("method").asText().equals("translate")) {
            if (jsonData.has("variable")) {
                result = transformation.translate(this.vertices,jsonData.get("variable").asText(),jsonData.get("value").asDouble());
            } else {
                result = transformation.translate(this.vertices,jsonData.get("tx").asDouble(),jsonData.get("ty").asDouble(),jsonData.get("tz").asDouble());
            }
            this.vertices = result;
        } else if (jsonData.get("method").asText().equals("scale")) {
            result = this.vertices;
        } else if (jsonData.get("method").asText().equals("rotate")) {
            if (jsonData.has("keyboard")) {
                if (jsonData.get("axis").asText().equals("x")) {
                    this.angleX += jsonData.get("angle").asDouble();
                    result = transformation.rotate(this.vertices,jsonData.get("axis").asText(),this.angleX);
                } else if (jsonData.get("axis").asText().equals("y")) {
                    this.angleY += jsonData.get("angle").asDouble();
                    result = transformation.rotate(this.vertices,jsonData.get("axis").asText(),this.angleY);
                } else if (jsonData.get("axis").asText().equals("z")) {
                    this.angleZ += jsonData.get("angle").asDouble();
                    result = transformation.rotate(this.vertices,jsonData.get("axis").asText(),this.angleZ);
                }
            } else {
                if (jsonData.get("axis").asText().equals("x")) {
                    this.angleX = jsonData.get("angle").asDouble();
                    result = transformation.rotate(this.vertices,jsonData.get("axis").asText(),this.angleX);
                } else if (jsonData.get("axis").asText().equals("y")) {
                    this.angleY = jsonData.get("angle").asDouble();
                    result = transformation.rotate(this.vertices,jsonData.get("axis").asText(),this.angleY);
                } else if (jsonData.get("axis").asText().equals("z")) {
                    this.angleZ = jsonData.get("angle").asDouble();
                    result = transformation.rotate(this.vertices,jsonData.get("axis").asText(),this.angleZ);
                }
            }
            System.out.println(this.angleX+" "+this.angleY +" "+this.angleZ);
        } else if (jsonData.get("method").asText().equals("reflect")) {
            result = transformation.reflect(this.vertices,jsonData.get("plane").asText());
        } else if (jsonData.get("method").asText().equals("perspective")) {
            if (jsonData.has("keyboard")) {
                distance = jsonData.get("distance").asDouble();
                result = transformation.perspective(this.vertices, distance);
            } else {
                distance += jsonData.get("distance").asDouble();
                System.out.println(distance);
                result = transformation.perspective(this.vertices, distance);
            }
        }
        return result;
    }

    @MessageMapping("/uploadFile")
    @SendTo("/topic/3dMode")
    public List<Point3D> handleFileUpload(String fileContent) {
        System.out.println("Получено содержимое файла: \n" + fileContent);
        this.vertices = parseFileContent(fileContent);
        return vertices;
    }

    private List<Point3D> parseFileContent(String fileContent) {
        List<Point3D> vertices = new ArrayList<>();
        String[] lines = fileContent.split("\n");

        for (String line : lines) {
            line = line.trim();
            if (!line.isEmpty() && !line.startsWith("#")) {
                String[] coords = line.split("\\s+");
                if (coords.length == 3) {
                    double x = Double.parseDouble(coords[0]);
                    double y = Double.parseDouble(coords[1]);
                    double z = Double.parseDouble(coords[2]);
                    vertices.add(new Point3D(x, y, z));
                }
            }
        }

        return vertices;
    }
}
