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

