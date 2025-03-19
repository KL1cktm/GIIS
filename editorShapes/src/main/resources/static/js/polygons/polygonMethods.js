canvas.addEventListener('click', (event) => {
    console.log("CLICK");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (linePoints) {
        pointsLine.push({x, y});
        drawPointLine(x, y);
        console.log("Точки для линии:", pointsLine.length);
    } else {
        points.push({x, y});
        drawPoint(x, y);
    }

    redrawCanvas();
});

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        drawPoint(point.x, point.y);
    });

    pointsLine.forEach(point => {
        drawPointLine(point.x, point.y);
    });

    if (pointsLine.length === 2) {
        let dataToSend = JSON.stringify({
            points: pointsLine,
            method: lineAlgorithm
        })
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/sendPolygonPoints', {}, dataToSend);
        }
        pointsLine = [];
    }

    lines.forEach(line => {
        const {algorithm, points} = line;

        if (points.length > 1) {
            if (algorithm === "WU") {
                drawWuLine(points);
            } else {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                points.forEach(point => ctx.lineTo(point.x, point.y));
                ctx.strokeStyle = getLineColor(algorithm);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    });

    if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
            drawLine(points[i - 1], points[i]);
        }
    }

    if (points.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    const filteredIntersections = filterClosePoints(intersections);

    if (filteredIntersections && filteredIntersections.length > 0) {
        filteredIntersections.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();
        });
    }
}

function filterClosePoints(points, threshold = 5) {
    const filteredPoints = [];

    points.forEach(point => {
        const isDuplicate = filteredPoints.some(
            filteredPoint => Math.hypot(filteredPoint.x - point.x, filteredPoint.y - point.y) < threshold
        );
        if (!isDuplicate) {
            filteredPoints.push(point);
        }
    });

    return filteredPoints;
}

function drawWuLine(points) {
    points.forEach(point => {
        drawWU(point.x, point.y, point.alpha)
    });
}

function drawWU(x, y, alpha) {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 255, ${Number(alpha)})`;
    ctx.fill();
    ctx.closePath();
}

function getLineColor(algorithm) {
    switch (algorithm) {
        case "DDA":
            return 'NavajoWhite';
        case "Bresenham":
            return 'purple';
        case "WU":
            return 'orange';
        default:
            return 'black';
    }
}

function drawPointLine(x, y) {
    console.log("Отрисовка точки для линии:", x, y);
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPolygon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => drawPoint(point.x, point.y));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    pointsLine = [];
    lines = [];
}

document.getElementById('clear').addEventListener('click', function () {
    clearCanvas();
    console.log("Clear canvas");
});

document.getElementById('convex').addEventListener('click', function () {
    if (points.length >= 3) {
        let dataToSend = JSON.stringify({
            points: points,
            method: "convex"
        });
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/sendPolygonPoints', {}, dataToSend);
        }
    } else {
        alert('Добавьте как минимум 3 точки для проверки на выпуклость.');
    }
});

document.getElementById('normals').addEventListener('click', function () {
    if (points.length >= 3) {
        let dataToSend = JSON.stringify({
            points: points,
            method: "normals"
        });
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/sendPolygonPoints', {}, dataToSend);
        }
    } else {
        alert('Добавьте как минимум 3 точки для проверки на выпуклость.');
    }
});

document.getElementById('graham').addEventListener('click', function () {
    if (points.length >= 3) {
        let dataToSend = JSON.stringify({
            points: points,
            method: "graham"
        });
        method = 'graham';
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/sendPolygonPoints', {}, dataToSend);
        }
    } else {
        alert('Добавьте как минимум 3 точки для проверки на выпуклость.');
    }
});

document.getElementById('jarvis').addEventListener('click', function () {
    if (points.length >= 3) {
        let dataToSend = JSON.stringify({
            points: points,
            method: "jarvis"
        });
        method = 'jarvis';
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/sendPolygonPoints', {}, dataToSend);
        }
    } else {
        alert('Добавьте как минимум 3 точки для проверки на выпуклость.');
    }
});

document.getElementById('Bresenham').addEventListener('click', function () {
    if (linePoints) {
        linePoints = false;
    } else {
        linePoints = true;
    }
    lineAlgorithm = "Bresenham";
});

document.getElementById('DDA').addEventListener('click', function () {
    if (linePoints) {
        linePoints = false;
    } else {
        linePoints = true;
    }
    lineAlgorithm = "DDA";
});

document.getElementById('WU').addEventListener('click', function () {
    if (linePoints) {
        linePoints = false;
    } else {
        linePoints = true;
    }
    lineAlgorithm = "WU";
});

document.getElementById('intersection').addEventListener('click', function () {
    let dataToSend = JSON.stringify({
        points: points,
        lines: lines,
        method: "intersection"
    })
    console.log("WEBSOCKET");
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/sendPolygonPoints', {}, dataToSend);
    }
});

