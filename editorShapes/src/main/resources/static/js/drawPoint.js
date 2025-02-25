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
    } else if (selectedTool === "Line2") {
        if (selectLine2 === "Circle") {
            ctx.fillStyle = 'Aquamarine';
        } else if (selectLine2 === "Ellipse") {
            ctx.fillStyle = 'Chartreuse';
        } else if (selectLine2 === "Hyperbola") {
            ctx.fillStyle = 'DarkMagenta';
        } else {
            ctx.fillStyle = 'BurlyWood';
        }
    } else if (selectedTool === "Curve") {
        if (selectLine2 === "Hermite") {
            ctx.fillStyle = 'Maroon';
        } else if (selectLine2 === "Beziers") {
            ctx.fillStyle = 'MistyRose';
        } else {
            ctx.fillStyle = 'Gray';
        }
    }
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (selectedTool === 'Line' || selectedTool === 'Pen') {
        basicTools(x, y);
    } else if (selectedTool === 'Line2') {
        secondTools(x, y);
    } else if (selectedTool === 'Curve') {
        curveTools(x, y);
    }
})

function curveTools(x, y) {
    points.push({x, y});
    if (selectLine2 === undefined) {
        selectLine2 = "Hermite";
    }
    let dataToSend;
    console.log("curveTools points number: " + numberOfPoints);
    console.log(selectLine2)
    if (selectLine2 === "Hermite") {
        console.log("method hermite");
        console.log(points.length);
        if (points.length === 4) {
            dataToSend = JSON.stringify({points, figure: selectLine2});
        }
    } else if (selectLine2 === "Beziers") {
        console.log("method beziers");
        if (points.length === 4) {
            dataToSend = JSON.stringify({points, figure: selectLine2});
        }
    } else {
        console.log("method lsaamite");
        if (points.length === Number(numberOfPoints)) {
            dataToSend = JSON.stringify({points, figure: selectLine2, degree: degree});
        }
    }
    console.log((selectLine2 === "B-spline" && points.length === numberOfPoints) || (selectLine2 !== "B-spline" && points.length === 4));
    console.log((selectLine2 === "B-spline" && points.length === numberOfPoints));
    console.log((selectLine2 !== "B-spline" && points.length === 4));
    console.log(points.length);
    console.log(numberOfPoints);
    console.log(selectLine2);
    console.log((selectLine2 === "B-spline"));
    console.log(points.length === Number(numberOfPoints));

    if ((selectLine2 === "B-spline" && points.length === Number(numberOfPoints)) || (selectLine2 !== "B-spline" && points.length === 4)) {
        if (stompClient && stompClient.connected) {
            console.log("push data");
            stompClient.send('/app/drawCurveLineOrder', {}, dataToSend);
        }
        points = [];
    }
}

function secondTools(x, y) {
    points.push({x, y});
    if (selectLine2 === undefined) {
        selectLine2 = "Circle";
    }
    let dataToSend;
    console.log(selectLine2)
    if (selectLine2 === "Circle") {
        dataToSend = JSON.stringify({points, figure: selectLine2, radius: radius});
    } else if (selectLine2 === "Ellipse") {
        dataToSend = JSON.stringify({points, figure: selectLine2, a: a, b: b});
    } else if (selectLine2 === "Hyperbola") {
        dataToSend = JSON.stringify({points, figure: selectLine2, a: a, b: b, position: position});
    } else {
        dataToSend = JSON.stringify({points, figure: selectLine2, a: a, b: b, position: position});
    }
    if (stompClient && stompClient.connected) {
        stompClient.send('/app/drawSecondLineOrder', {}, dataToSend);
    }
    points = [];
}

function basicTools(x, y) {
    if (selectedTool === 'Line') {
        points.push({x, y});
    }

    drawPoint(x, y);

    if (points.length === 2) {
        if (selectAlgorithm === undefined) {
            selectAlgorithm = "DDA";
        }
        const dataToSend = JSON.stringify({tool: selectedTool, points, alg: selectAlgorithm});
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