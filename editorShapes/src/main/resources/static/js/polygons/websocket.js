let stompClient = null
const canvas = document.getElementById('canvasPolygon');
const ctx = canvas.getContext('2d');

function connect1() {
    const socket = new SockJS('/polygon');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/convexResult', function(response) {
            const isConvex = JSON.parse(response.body);
            convex(isConvex);
        });
        stompClient.subscribe('/topic/getNormals', function(response) {
            const normals = JSON.parse(response.body);
            drawNormals(normals);
        });
        stompClient.subscribe('/topic/convexHull', function(response) {
            const hull = JSON.parse(response.body);
            drawConvexHull(hull);
        });
        stompClient.subscribe('/topic/line', function(response) {
            const data = JSON.parse(response.body);
            const { algorithm, points } = data;
            points.forEach(point => {
                console.log(`alpha: ${point.alpha}`);
            });
            lines.push({ algorithm, points });
            redrawCanvas();
        });
        stompClient.subscribe('/topic/intersection', function(response) {
            intersections = JSON.parse(response.body);
            redrawCanvas();
        });
    }, (error) => {
        console.error('Ошибка подключения:', error);
    });
}

function drawConvexHull(hull) {
    if (!hull || hull.length === 0) {
        console.error("Выпуклая оболочка не найдена или пуста.");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        drawPoint(point.x, point.y, 'PaleTurquoise');
    });

    hull.forEach(point => {
        drawPoint(point.x, point.y, 'Tomato');
    });

    ctx.beginPath();
    ctx.moveTo(hull[0].x, hull[0].y);
    hull.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    if (method === 'graham')
    {
        ctx.strokeStyle = 'ForestGreen';
    } else  {
        ctx.strokeStyle = 'MidnightBlue';
    }
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawNormals(normals) {
    const normalLength = 50;

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        const nx = normals[i].x;
        const ny = normals[i].y;

        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + nx * normalLength, midY + ny * normalLength);
        ctx.strokeStyle = 'DeepSkyBlue';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function convex(isConvex) {
    if (!isConvex) {
        alert('Полигон является вогнутым');
    } else {
        alert('Полигон является выпуклым');
    }
    console.log("Полигон выпуклый:", isConvex);
}

function disconnect1() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}

window.addEventListener('load', () => {
    connect1();
});

window.addEventListener('beforeunload', () => {
    disconnect1();
});