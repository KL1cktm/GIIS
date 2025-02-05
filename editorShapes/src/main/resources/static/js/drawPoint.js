function drawPoint(x, y, alpha) {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    if (selectedTool === 'Pen') {
        ctx.fillStyle = colorInput.value;
    } else if (selectedTool === 'Line') {
        if (selectAlgorithm === 'DDA') {
            ctx.fillStyle = 'red';
        } else if (selectAlgorithm === 'Bresenham') {
            ctx.fillStyle = 'green';
        } else if (selectAlgorithm === 'VU') {
            ctx.fillStyle = 'rgba(0, 0, 255, ' + alpha + ')';
        } else {
            ctx.fillStyle = 'black';
        }
    } else {
        ctx.fillStyle = 'Aquamarine';
    }
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (selectedTool === 'Line' || selectedTool === 'Pen') {
        basicTools(x,y)
    } else if (selectedTool === 'Line2') {
        secondTools(x,y)
    }
})

function secondTools(x, y) {
    points.push({ x, y });
    const dataToSend = JSON.stringify({ points, figure: selectLine2, radius: radius });
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/drawSecondLineOrder', {}, dataToSend);
    }
    points = [];
}

function basicTools(x, y) {
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
}

clearBtn.addEventListener('click', clearCanvas);

function clearCanvas() {
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    logArea.value += "\n\n\n\n\n\n\nDEBUG MODE\n";
    logArea.scrollTop = logArea.scrollHeight;
    console.log('Canvas and points cleared');
    if (debugMode) {
        printGrid();
    }
}