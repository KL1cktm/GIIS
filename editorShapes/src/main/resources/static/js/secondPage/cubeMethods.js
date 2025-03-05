function rotateX(vertex, angle) {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const y = vertex.y * cos - vertex.z * sin;
    const z = vertex.y * sin + vertex.z * cos;

    return { x: vertex.x, y, z };
}

function rotateY(vertex, angle) {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const x = vertex.x * cos - vertex.z * sin;
    const z = vertex.x * sin + vertex.z * cos;

    return { x, y: vertex.y, z };
}

function rotateCube(vertices, angleY, angleX) {
    return vertices.map(vertex => {
        let rotated = vertex;

        if (angleY) {
            rotated = rotateY(rotated, angleY);
        }

        if (angleX) {
            rotated = rotateX(rotated, angleX);
        }

        return rotated;
    });
}

function drawCube(vertices) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем canvas
    const rotatedVertices = rotateCube(vertices, 30, 30);

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    rotatedVertices.forEach(vertex => {
        const x2d = vertex.x * scale + offsetX;
        const y2d = -vertex.y * scale + offsetY;

        ctx.beginPath();
        ctx.arc(x2d, y2d, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    });

    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    edges.forEach(edge => {
        const v1 = rotatedVertices[edge[0]];
        const v2 = rotatedVertices[edge[1]];

        const x1 = v1.x * scale + offsetX;
        const y1 = -v1.y * scale + offsetY;
        const x2 = v2.x * scale + offsetX;
        const y2 = -v2.y * scale + offsetY;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    });
}