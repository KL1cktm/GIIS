toggleMode.addEventListener('change', () => {
    logArea.style.display = toggleMode.checked ? 'block' : 'none';
    debugMode = toggleMode.checked;
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