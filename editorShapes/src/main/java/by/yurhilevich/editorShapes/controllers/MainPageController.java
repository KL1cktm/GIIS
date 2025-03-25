package by.yurhilevich.editorShapes.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller()
public class MainPageController {

    @GetMapping("/")
    public String mainPage() {
        return "redirect:/lab1";
    }

    @GetMapping("/lab1")
    public String lab1Page() {
        return "Editor";
    }

    @GetMapping("/lab2")
    public String lab2Page() {
        return "3dMode";
    }

    @GetMapping("/polygon")
    public String polygonPage() {
        return "Polygon";
    }

    @GetMapping("/deloneAndVerone")
    public String lab7Page() {
        return "lab7";
    }
}
