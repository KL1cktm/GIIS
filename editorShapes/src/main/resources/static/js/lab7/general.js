let stompClient = null
const canvas = document.getElementById('canvasLab');
const ctx = canvas.getContext('2d');

const clearButton = document.getElementById("clear");
const deloneButton = document.getElementById('delone');
const voronButton = document.getElementById('voron');

let points = []



canvas.addEventListener('click', () => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    points.push({x: x, y: y});
    drawPoint(x, y, "red");
});

function drawPoint(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

deloneButton.addEventListener('click', () => {
    console.log("Delone");
    const dataToSend = JSON.stringify({algorithm: "delone", points});
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/sendPointsLab7', {}, dataToSend);
    }
});

voronButton.addEventListener('click', () => {
    console.log("voron");
    const dataToSend = JSON.stringify({algorithm: "voron", points});
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/sendPointsLab7', {}, dataToSend);
    }
});

clearButton.addEventListener('click', () => {
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function connect1() {
    const socket = new SockJS('/lab7');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/delone', function (response) {
            const data = JSON.parse(response.body);
            drawTriangles(data);
            ////
        });
        stompClient.subscribe('/topic/voron', function(response) {
            const edges = JSON.parse(response.body);
            drawVoronoiEdges(edges);
        });

    }, (error) => {
        console.error('Ошибка подключения:', error);
    });
}

function drawVoronoiEdges(edges) {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;

    edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.p1.x, edge.p1.y);
        ctx.lineTo(edge.p2.x, edge.p2.y);
        ctx.stroke();
    });
}

function drawTriangles(triangles) {

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(173, 216, 230, 0.3)'; // Светло-голубая заливка с прозрачностью

    triangles.forEach(triangle => {
        ctx.beginPath();
        ctx.moveTo(triangle.a.x, triangle.a.y);
        ctx.lineTo(triangle.b.x, triangle.b.y);
        ctx.lineTo(triangle.c.x, triangle.c.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    console.log('Отрисовано треугольников: ' + triangles.length);
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