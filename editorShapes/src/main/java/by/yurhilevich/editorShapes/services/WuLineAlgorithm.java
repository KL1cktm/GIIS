package by.yurhilevich.editorShapes.services;

import by.yurhilevich.editorShapes.models.Point;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WuLineAlgorithm {

    @Autowired
    ParsePointsToAlgorithmsService parsePointsToAlgorithmsService;

    public List<Point> drawLine(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        points.get(0).setAlpha(1.0);
        points.get(1).setAlpha(1.0);

        int x0 = points.get(0).getX();
        int y0 = points.get(0).getY();
        int x1 = points.get(1).getX();
        int y1 = points.get(1).getY();

        boolean steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

        if (steep) {
            int temp;
            temp = x0; x0 = y0; y0 = temp;
            temp = x1; x1 = y1; y1 = temp;
        }

        if (x0 > x1) {
            int temp;
            temp = x0; x0 = x1; x1 = temp;
            temp = y0; y0 = y1; y1 = temp;
        }

        float dx = x1 - x0;
        float dy = y1 - y0;
        float gradient = (dx == 0) ? 1 : dy / dx;

        int xEnd = Math.round(x0);
        float yEnd = y0 + gradient * (xEnd - x0);
        float xGap = 1 - (x0 + 0.5f - (int)(x0 + 0.5f));
        int xPixel1 = xEnd;
        int yPixel1 = (int) yEnd;

        points.add(new Point(steep ? yPixel1 : xPixel1, steep ? xPixel1 : yPixel1, 1 - (yEnd - yPixel1)));
        points.add(new Point(steep ? yPixel1 + 1 : xPixel1, steep ? xPixel1 : yPixel1 + 1, (yEnd - yPixel1)));

        float interY = yEnd + gradient;

        for (int x = xPixel1 + 1; x < x1; x++) {
            int y = (int) interY;
            points.add(new Point(steep ? y : x, steep ? x : y, 1 - (interY - y)));
            points.add(new Point(steep ? y + 1 : x, steep ? x : y + 1, (interY - y)));
            interY += gradient;
        }

        xEnd = Math.round(x1);
        yEnd = y1 + gradient * (xEnd - x1);
        xGap = (x1 + 0.5f - (int)(x1 + 0.5f));
        int xPixel2 = xEnd;
        int yPixel2 = (int) yEnd;

        points.add(new Point(steep ? yPixel2 : xPixel2, steep ? xPixel2 : yPixel2, 1 - (yEnd - yPixel2)));
        points.add(new Point(steep ? yPixel2 + 1 : xPixel2, steep ? xPixel2 : yPixel2 + 1, (yEnd - yPixel2)));

        return points;
    }


}
