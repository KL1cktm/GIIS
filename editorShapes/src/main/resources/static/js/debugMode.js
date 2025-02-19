toggleMode.addEventListener('change', () => {
    logArea.style.display = toggleMode.checked ? 'block' : 'none';
    debugMode = toggleMode.checked;
    if (debugMode) {
        printGrid();
    } else {
        clearCanvas();
    }
});

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

function printGrid() {
    const step = 20;
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}