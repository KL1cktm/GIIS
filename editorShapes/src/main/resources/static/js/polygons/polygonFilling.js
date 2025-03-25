let debugMode = false;
let speed = 50;


document.getElementById('debugMode').addEventListener('click', () => {
    debugMode = !debugMode;
    document.getElementById('debugMode').textContent = debugMode ? 'Debug Mode: ON' : 'Debug Mode: OFF';
});

document.getElementById('speed').addEventListener('input', (e) => {
    speed = 101 - e.target.value;
});

document.getElementById('scanlineFill').addEventListener('click', () => {
    scanlineFill(points);
});

document.getElementById('activeEdgeFill').addEventListener('click', () => {
    activeEdgeFill(points);
});

document.getElementById('floodFill').addEventListener('click', () => {
    floodFill(points);
});

document.getElementById('scanlineFloodFill').addEventListener('click', () => {
    scanlineFloodFill(points);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scanlineFill(points) {
    if (points.length < 3) return;

    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    for (let y = minY; y <= maxY; y++) {
        let intersections = [];

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            if ((p1.y <= y && p2.y > y) || (p2.y <= y && p1.y > y)) {
                const x = p1.x + ((y - p1.y) / (p2.y - p1.y)) * (p2.x - p1.x);
                intersections.push(x);
            }
        }

        intersections.sort((a, b) => a - b);

        for (let i = 0; i < intersections.length; i += 2) {
            const x1 = intersections[i];
            const x2 = intersections[i + 1];

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();

            if (debugMode) await sleep(speed);
        }
    }
}

async function activeEdgeFill(points) {
    if (points.length < 3) return;

    const edges = [];
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        if (p1.y !== p2.y) {
            const ymin = Math.min(p1.y, p2.y);
            const ymax = Math.max(p1.y, p2.y);
            const x = p1.y < p2.y ? p1.x : p2.x;
            const slope = (p2.x - p1.x) / (p2.y - p1.y);

            edges.push({ ymin, ymax, x, slope });
        }
    }

    edges.sort((a, b) => a.ymin - b.ymin);

    let activeEdges = [];
    for (let y = minY; y <= maxY; y++) {
        for (let i = 0; i < activeEdges.length; i++) {
            activeEdges[i].x += activeEdges[i].slope;
        }

        activeEdges = activeEdges.filter(edge => edge.ymax > y);

        while (edges.length > 0 && edges[0].ymin <= y) {
            activeEdges.push(edges.shift());
        }

        activeEdges.sort((a, b) => a.x - b.x);

        for (let i = 0; i < activeEdges.length; i += 2) {
            const x1 = Math.ceil(activeEdges[i].x);
            const x2 = Math.floor(activeEdges[i + 1].x);

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();

            if (debugMode) await sleep(speed);
        }
    }
}

function getPolygonCenter(polygon) {
    let x = 0, y = 0;
    for (const point of polygon) {
        x += point.x;
        y += point.y;
    }
    return { x: x / polygon.length, y: y / polygon.length };
}

async function floodFill(points) {
    if (points.length < 3) return;

    const { x: startX, y: startY } = getPolygonCenter(points);

    if (!isPointInPolygon(startX, startY, points)) return;

    const stack = [[startX, startY]];
    const filled = new Array(canvas.width * canvas.height).fill(false);

    async function processFrame() {
        const startTime = performance.now();
        while (stack.length > 0 && performance.now() - startTime < 16) {
            const [x, y] = stack.pop();
            const index = y * canvas.width + x;

            if (!filled[index] && isPointInPolygon(x, y, points)) {
                ctx.fillRect(x, y, 1, 1);
                filled[index] = true;

                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);

                if (debugMode) {
                    await sleep(speed);
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                    ctx.fillRect(x, y, 1, 1);
                    ctx.fillStyle = 'black';
                }
            }
        }

        if (stack.length > 0) {
            requestAnimationFrame(processFrame);
        }
    }

    requestAnimationFrame(processFrame);
}

async function scanlineFloodFill(points) {
    if (points.length < 3) return;

    const { x: startX, y: startY } = getPolygonCenter(points);

    if (!isPointInPolygon(startX, startY, points)) return;

    const stack = [[startX, startY]];
    const filled = new Array(canvas.width * canvas.height).fill(false);

    async function processFrame() {
        const startTime = performance.now();
        while (stack.length > 0 && performance.now() - startTime < 16) {
            const [x, y] = stack.pop();
            let left = x;
            let right = x;

            while (left >= 0 && isPointInPolygon(left, y, points)) {
                left--;
            }

            while (right < canvas.width && isPointInPolygon(right, y, points)) {
                right++;
            }

            for (let i = left + 1; i < right; i++) {
                const index = y * canvas.width + i;

                if (!filled[index]) {
                    ctx.fillRect(i, y, 1, 1);
                    filled[index] = true;

                    if (debugMode) {
                        await sleep(speed);
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                        ctx.fillRect(i, y, 1, 1);
                        ctx.fillStyle = 'black';
                    }
                }
            }

            if (y + 1 < canvas.height) {
                for (let i = left + 1; i < right; i++) {
                    const index = (y + 1) * canvas.width + i;
                    if (!filled[index] && isPointInPolygon(i, y + 1, points)) {
                        stack.push([i, y + 1]);
                    }
                }
            }

            if (y - 1 >= 0) {
                for (let i = left + 1; i < right; i++) {
                    const index = (y - 1) * canvas.width + i;
                    if (!filled[index] && isPointInPolygon(i, y - 1, points)) {
                        stack.push([i, y - 1]);
                    }
                }
            }
        }

        if (stack.length > 0) {
            requestAnimationFrame(processFrame);
        }
    }

    requestAnimationFrame(processFrame);
}

function isPointInPolygon(x, y, polygon) {
    let wn = 0;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        if (yi <= y) {
            if (yj > y && isLeft(xi, yi, xj, yj, x, y) > 0) {
                wn++;
            }
        } else {
            if (yj <= y && isLeft(xi, yi, xj, yj, x, y) < 0) {
                wn--;
            }
        }
    }

    return wn !== 0;
}

function isLeft(x0, y0, x1, y1, x, y) {
    return (x1 - x0) * (y - y0) - (x - x0) * (y1 - y0);
}