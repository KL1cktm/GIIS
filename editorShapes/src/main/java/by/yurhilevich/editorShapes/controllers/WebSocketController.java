package by.yurhilevich.editorShapes.controllers;

import by.yurhilevich.editorShapes.models.Point;
import by.yurhilevich.editorShapes.services.BresenhamAlgorithm;
import by.yurhilevich.editorShapes.services.BresenhamCircleAlgorithm;
import by.yurhilevich.editorShapes.services.DigitalDifferentialAnalyzer;
import by.yurhilevich.editorShapes.services.WuLineAlgorithm;
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
    private final BresenhamCircleAlgorithm bresenhamCircleAlgorithm;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, WuLineAlgorithm wuLineAlgorithm,
                               DigitalDifferentialAnalyzer numericDiffAnalyzer, BresenhamAlgorithm bresenhamAlgorithm,
                               BresenhamCircleAlgorithm bresenhamCircleAlgorithm) {
        this.messagingTemplate = messagingTemplate;
        this.wuLineAlgorithm = wuLineAlgorithm;
        this.digitalDifferentialAnalyzer = numericDiffAnalyzer;
        this.bresenhamAlgorithm = bresenhamAlgorithm;
        this.bresenhamCircleAlgorithm = bresenhamCircleAlgorithm;
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
        if (jsonData.get("figure").asText().equals("Circle")) {
            result = bresenhamCircleAlgorithm.generateCircle(jsonData);
            result.remove(0);
        }
        return result;
    }
}
