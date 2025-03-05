# Графический интерфейс интеллектуальных систем. Графический редактор
<details>
  <summary>Лаб 1</summary>
  
## Цель
Разработать элементарный графический редактор, реализующий построение отрезков с помощью алгоритма ЦДА, целочисленного алгоритма Брезенхема и алгоритма Ву. Вызов способа генерации отрезка задается из пункта меню и доступно через панель инструментов «Отрезки». В редакторе кроме режима генерации отрезков в пользовательском окне должен быть предусмотрен отладочный режим, где отображается пошаговое решение на дискретной сетке.

## Описание алгоритмов
### Цифровой Дифференциальный Анализатор
Цифровой дифференциальный анализатор (ЦДА) – это алгоритм, основанный на аппроксимации прямой линии путем равномерного приращения координат. Он разбивает отрезок на равные шаги по одной из координат и вычисляет соответствующие значения другой координаты.

### Алгоритм Брезенхема
Алгоритм Брезенхема основан на выборе оптимального пикселя с использованием целочисленных вычислений. В отличие от ЦДА, он исключает необходимость работы с дробными числами, используя пошаговое накопление ошибки, чтобы принять решение о том, какой пиксель закрасить на следующем шаге.

### Алгоритм Ву
Алгоритм Ву предназначен для построения сглаженных (антиалиасинговых) линий. В отличие от Брезенхема, который выбирает один пиксель на каждом шаге, Ву использует два соседних пикселя, назначая им разные уровни яркости, чтобы сгладить границы линии и уменьшить эффект "ступенек" (aliasing).

## Интерфейс
![image](https://github.com/user-attachments/assets/8e8ca62e-dfca-4508-a474-03065f326272)

## Реализация
Функция получения данных от клиента через WebSocket, выбор соответствующего алгоритма.
```java
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
```

Функция отрисовки точки на стороне клиента.
```js
function drawPoint(x, y, alpha) {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    if (selectedTool === 'Pen') {
        ctx.fillStyle = colorInput.value;
    } else {
        if (selectAlgorithm === 'DDA') {
            ctx.fillStyle = 'red';
        } else if (selectAlgorithm === 'Bresenham') {
            ctx.fillStyle = 'green';
        } else if (selectAlgorithm === 'VU') {
            ctx.fillStyle = 'rgba(0, 0, 255, ' + alpha + ')';
        } else {
            ctx.fillStyle = 'black';
        }
    }
    ctx.fill();
    ctx.closePath();
}
```

## Вывод
В результате реализации графического редактора, использующего алгоритмы построения отрезков (ЦДА, Брезенхема и Ву), была создана система, обеспечивающая интерактивное рисование отрезков с возможностью отображения пошагового процесса.

</details>

<details>
  <summary>Лаб 2</summary>
  
## Цель
Разработать элементарный графический редактор, реализующий построение линий второго порядка. Вызов способа генерации линии второго порядка задается из пункта меню и доступно через панель инструментов «Линии 2-го порядка». В редакторе кроме режима генерации линий второго порядка в пользовательском окне должен быть предусмотрен отладочный режим, где отображается пошаговое решение на дискретной сетке.

## Описание алгоритмов
### Алгоритм построения окружности
Алгоритм использует метод Брезенхэма для построения окружности. Начиная с точки (0, r), он вычисляет точки окружности в одном октанте, а затем симметрично отражает их в остальные семь октантов. Решающая переменная d определяет, какую точку выбрать на следующем шаге. Для каждой вычисленной точки добавляются восемь симметричных точек относительно центра окружности (xc, yc).

### Алгоритм построения эллипса
Алгоритм адаптирует метод Брезенхэма для построения эллипса. Эллипс делится на две части: верхнюю и нижнюю. Начиная с точки (0, b), алгоритм вычисляет точки эллипса, используя решающую переменную d. В первой части алгоритма строится верхняя половина эллипса, а во второй — нижняя. Для каждой точки добавляются четыре симметричные точки относительно центра эллипса (xc, yc).

### Алгоритм построения гиперболы
Алгоритм строит гиперболу, используя параметрическое уравнение. В зависимости от ориентации гиперболы (вертикальная или горизонтальная), он обходит значения y или x с шагом step и вычисляет соответствующие точки. Для каждой точки добавляются четыре симметричные точки относительно центра гиперболы (xc, yc). Шаг step определяет плотность точек и влияет на точность отображения гиперболы.

### Алгоритм построения параболы
Алгоритм строит параболу, используя параметрическое уравнение. В зависимости от ориентации параболы (вверх или вниз), он обходит значения y и вычисляет соответствующие значения x. Для каждого y добавляются две симметричные точки относительно оси параболы. Алгоритм позволяет задать параметры параболы (a и n), которые влияют на её форму.

## Интерфейс
![image](https://github.com/user-attachments/assets/49a37b9d-de85-41f6-925d-01e58f980075)


## Реализация
Функция получения данных от клиента через WebSocket, выбор соответствующего алгоритма.
```java
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
```

Алгоритм построения параболы.
```java
public List<Point> generateParabola(JsonNode jsonData) {
        List<Point> points = parsePointsToAlgorithmsService.parseFromJson(jsonData);
        int xc = points.getFirst().getX();
        int yc = points.getFirst().getY();
        double a = jsonData.get("a").asDouble();
        double n = jsonData.get("b").asDouble();
        boolean position = jsonData.get("position").asBoolean();

        int yLimit = 300;
        for (int y = 0; y <= yLimit; y++) {
            double x = Math.pow(y / a, 1.0 / n);
            int xPixel = (int) Math.round(x);

            int yPixel = position ? yc - y : yc + y;
            points.add(new Point(xc + xPixel, yPixel));
            points.add(new Point(xc - xPixel, yPixel));
        }

        return points;
    }
```

## Вывод
В ходе работы был создан простой графический редактор, позволяющий строить и визуализировать различные кривые, включая окружности, эллипсы, гиперболы и параболы. Для взаимодействия между серверной и клиентской частями использовался WebSocket, обеспечивающий передачу параметров в реальном времени.

</details>

<details>
  <summary>Лаб 3</summary>
  
## Цель
Разработать элементарный графический редактор, реализующий построение параметрических кривых, используя форму Эрмита, форму Безье и B-сплайн. Выбор метода задается из пункта меню и доступен через панель инструментов «Кривые». В редакторе должен быть предусмотрен режим корректировки опорных точек и состыковки сегментов. В программной реализации необходимо реализовать базовые функции матричных вычислений.

## Описание алгоритмов
### Алгоритм построения кривой Эрмита
Кривая Эрмита — это параметрическая кривая, которая задается двумя точками (начало и конец кривой) и двумя касательными векторами в этих точках. Она позволяет плавно интерполировать между двумя точками, учитывая направление и скорость изменения кривой в этих точка

### Алгоритм построения кривой Безье
Кривая Безье — это параметрическая кривая, которая задается набором контрольных точек. В вашем случае используется кубическая кривая Безье, которая требует четыре контрольные точки. Кривая Безье плавно интерполирует между этими точками, создавая гладкую форму.

### Алгоритм построения B-сплайна
B-сплайн — это более гибкая параметрическая кривая, которая задается набором контрольных точек и узловым вектором. Узловой вектор определяет, как контрольные точки влияют на форму кривой. B-сплайн позволяет создавать сложные кривые с высокой степенью гладкости.

## Интерфейс
![image](https://github.com/user-attachments/assets/7d5c5dad-d41c-450b-972e-9147c8fc2652)



## Реализация
Функция получения данных от клиента через WebSocket, выбор соответствующего алгоритма.
```java
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
```

Алгоритм построения кривой Эрмита.
```java
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
```

## Вывод
В ходе работы был создан простой графический редактор, позволяющий строить и визуализировать различные кривые алгоритмами Эрмита, Безье, B-сплайна. Для взаимодействия между серверной и клиентской частями использовался WebSocket, обеспечивающий передачу параметров в реальном времени.

</details>

<details>
  <summary>Лаб 3</summary>
  
## Цель
Разработать графическую программу, выполняющую следующие геометрические преобразования над трехмерным объектом: перемещение, поворот, скалирование, отображение, перспектива. В программе должно быть предусмотрено считывание координат 3D объекта из текстового файла, обработка клавиатуры и выполнение геометрических преобразований в зависимости от нажатых клавиш. Все преобразования следует производить с использованием матричного аппарата и представления координат в однородных координатах.

## Афинные преобразования
Аффинные преобразования — это класс геометрических преобразований в пространстве, которые сохраняют прямые линии и параллельность. Они широко используются в компьютерной графике, машинном обучении, физике и других областях для изменения положения, размера, ориентации и формы объектов.
## Интерфейс
![image](https://github.com/user-attachments/assets/e86b1ada-9e37-40d6-9305-c89a46f8f48e)




## Реализация
Парс точек из файла.
```java
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
```

Функция получения данных от клиента через WebSocket, выбор соответствующего алгоритма.
```java
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
```

Функции для отображения вдоль оси XY.
```java
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

public List<Point3D> reflectXY(List<Point3D> vertices) {
        return applyTransformation(vertices, REFLECT_XY_MATRIX);
    }

private List<Point3D> applyTransformation(List<Point3D> vertices, Matrix4x4 matrix) {
        List<Point3D> transformedVertices = new ArrayList<>();
        for (Point3D vertex : vertices) {
            transformedVertices.add(matrix.multiply(vertex));
        }
        return transformedVertices;
    }

private static final Matrix4x4 REFLECT_XY_MATRIX = new Matrix4x4(new double[][]{
            {1, 0, 0, 0},
            {0, 1, 0, 0},
            {0, 0, -1, 0},
            {0, 0, 0, 1}
    });
```

## Вывод
В ходе работы был создан простой графический редактор, позволяющий работать с 3D объектами и выполнять основвные функции, такие как перемещение, отражение, перспектива, масштабирование, вращение. Для взаимодействия между серверной и клиентской частями использовался WebSocket, обеспечивающий передачу параметров в реальном времени.

</details>


## Технологии
- Java
- Spring Boot
- Spring Web
- Lombok
- WebSocket
- Bootstap
- JavaScript
- HTML5
- CSS

