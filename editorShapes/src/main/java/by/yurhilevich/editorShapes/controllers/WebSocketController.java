package by.yurhilevich.editorShapes.controllers;

import by.yurhilevich.editorShapes.models.Point;
import by.yurhilevich.editorShapes.services.BresenhamAlgorithm;
import by.yurhilevich.editorShapes.services.NumericDiffAnalyzer;
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

    @Autowired
    BresenhamAlgorithm algorithm;

    @Autowired
    NumericDiffAnalyzer analyzer;

    @Autowired
    WuLineAlgorithm wuLineAlgorithm;

    private SimpMessagingTemplate messagingTemplate;

    // Внедряем SimpMessagingTemplate для отправки сообщений
    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/draw")  // Принимаем данные от клиента
    @SendTo("/topic/line")    // Отправляем их всем подписанным клиентам
    public List<Point> receivePoints(@RequestBody JsonNode jsonData) {
        System.out.println("websocket correct work");
        List<Point> result;
        String tool = jsonData.get("tool").asText();
        System.out.println("Selected tool: " + tool);

        System.out.println("Selected algorithm: " + jsonData.get("alg").asText());
        if (jsonData.get("alg").asText().equals("CDA")) {
            result = analyzer.processing(jsonData);
        } else if (jsonData.get("alg").asText().equals("Bresenham")) {
            result = algorithm.drawLine(jsonData);
        } else {
            result = wuLineAlgorithm.drawLine(jsonData);
        }
        return result;
    }
}
