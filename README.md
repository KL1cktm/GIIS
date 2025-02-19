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

## Вывод
В результате реализации графического редактора, использующего алгоритмы построения отрезков (ЦДА, Брезенхема и Ву), была создана система, обеспечивающая интерактивное рисование отрезков с возможностью отображения пошагового процесса.
