const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const toggleMode = document.getElementById('toggleMode');
const logArea = document.getElementById('logArea');
const toolButtons = document.querySelectorAll('[data-tool]'); // Исправленный селектор
const algorithmButtons = document.querySelectorAll('[data-alg]');
const clearBtn = document.getElementById('clearCanvas');
const algorithmSelector = document.getElementById('algorithmSelector');
const colorInput = document.getElementById('lineColor');


let stompClient = null;
let points = [];
let selectedTool = 'Pen';
let selectAlgorithm = 'DDA';
let debugMode = false;


toolButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        selectedTool = event.target.getAttribute('data-tool');

        if (selectedTool === 'Line') {
            algorithmSelector.style.display = 'inline-block';
        } else {
            algorithmSelector.style.display = 'none';
        }
    });
});

clearBtn.addEventListener('click', clearCanvas);

function clearCanvas() {
    points = [];  // Очищаем массив точек
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    logArea.value += "\n\n\n\n\n\n\nDEBUG MODE\n";
    logArea.scrollTop = logArea.scrollHeight;
    console.log('Canvas and points cleared');
}

function connect() {
    const socket = new SockJS('/lab1');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/line', (message) => {
            const pointsFromServer = JSON.parse(message.body);
            checkDebugMode(pointsFromServer);
            console.log('Received points from server');
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}

function checkDebugMode(points) {
    console.log("debug: " + debugMode);
    if (debugMode) {
        points.forEach((point, index) => {
            setTimeout(function() {
                drawPoint(point.x, point.y, point.alpha);
                writeLog(point);
            }, index * 10);
        });
    } else {
        points.forEach(point => drawPoint(point.x, point.y, point.alpha));
    }
}

function writeLog(point) {
    if (selectAlgorithm === 'VU') {
        if (point.alpha !== 0.0) {
            logArea.value += "Point with coords \tx: " + point.x + " \t\ty: " + point.y + " \t\talpha: " + Math.round(point.alpha * 100) / 100 + ' \twas printed\n';
            logArea.scrollTop = logArea.scrollHeight;
        }
    } else {
        logArea.value += "Point with coords \tx: " + point.x + " \t\ty: " + point.y + ' \twas printed\n';
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function drawPoint(x, y, alpha = 0.3) {
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

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (selectedTool === 'Line') {
        points.push({ x, y });
    }

    drawPoint(x, y);

    if (points.length === 2) {
        const dataToSend = JSON.stringify({ tool: selectedTool, points, alg: selectAlgorithm });
        if (stompClient && stompClient.connected) {
            stompClient.send('/app/draw', {}, dataToSend);
        }
        points = [];
    }
});

algorithmButtons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        selectAlgorithm = event.target.getAttribute('data-alg');
    });
});

toggleMode.addEventListener('change', () => {
    logArea.style.display = toggleMode.checked ? 'block' : 'none';
    debugMode = toggleMode.checked;
});

window.addEventListener('load', connect);

window.addEventListener('beforeunload', disconnect);