let stompClient1 = null;

function connect1() {
    const socket = new SockJS('/lab2');
    stompClient1 = Stomp.over(socket);

    stompClient1.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient1.subscribe('/topic/3dMode', (message) => {
            const pointsFromServer = JSON.parse(message.body);
            drawCube(pointsFromServer);
            console.log('Received points from server');
        });
    }, (error) => {
        console.error('Ошибка подключения:', error);
    });
}

function disconnect1() {
    if (stompClient1 !== null) {
        stompClient1.disconnect();
    }
}

function drawPoints(points) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    });
}

document.getElementById('loadFile').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = () => {
            const fileContent = reader.result;
            console.log('Содержимое файла:', fileContent);

            if (stompClient1 && stompClient1.connected) {
                stompClient1.send('/app/uploadFile', {}, fileContent);
            } else {
                alert('Ошибка: STOMP соединение не установлено.');
            }
        };

        reader.onerror = () => {
            console.error('Ошибка при чтении файла');
            alert('Ошибка при чтении файла.');
        };
    }
});

let ctrlPressed = false;
let shiftPressed = false;
let bracketRightPressed = false;
let bracketLeftPressed = false;
let keyZPressed = false;
let keyXPressed = false;
let keyYPressed = false;
let keyCPressed = false;
let keyPeriodPressed = false;
let keyCommaPressed = false;

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        ctrlPressed = true;
    }

    if (event.shiftKey) {
        shiftPressed = true;
    }

    if (event.code === 'BracketRight') {
        bracketRightPressed = true;
    }

    if (event.code === 'BracketLeft') {
        bracketLeftPressed = true;
    }

    if (event.code === 'KeyZ') {
        keyZPressed = true;
    }

    if (event.code === 'KeyX') {
        keyXPressed = true;
    }

    if (event.code === 'KeyY') {
        keyYPressed = true;
    }

    if (event.code === 'KeyC') {
        keyCPressed = true;
    }

    if (event.code === 'Period') {
        keyPeriodPressed = true;
    }

    if (event.code === 'Comma') {
        keyCommaPressed = true;
    }

    let action = null;
    let value = 0;
    let variable = null;
    let axis = null;
    let plane = null;
    let distance = null;

    if (shiftPressed) {
        if (keyXPressed && keyYPressed) {
            console.log("Shift + X + Y: Отражение по плоскости XY");
            action = 'reflect';
            plane = 'xy';
        } else if (keyXPressed && keyZPressed) {
            console.log("Shift + X + Z: Отражение по плоскости XZ");
            action = 'reflect';
            plane = 'xz';
        } else if (keyYPressed && keyZPressed) {
            console.log("Shift + Y + Z: Отражение по плоскости YZ");
            action = 'reflect';
            plane = 'yz';
        } else if (bracketRightPressed) {
            action = 'perspective';
            distance = 1;
        } else if (bracketLeftPressed) {
            action = 'perspective';
            distance = -1;
        }
    }

    if (action === 'perspective' && stompClient1 && stompClient1.connected) {
        const dataToSend = JSON.stringify({
            method: action,
            distance: distance
        });

        stompClient1.send('/app/3dMode', {}, dataToSend);
        console.log('Сообщение отправлено на сервер:', dataToSend);
    }

    if (action === 'reflect' && stompClient1 && stompClient1.connected) {
        const dataToSend = JSON.stringify({
            method: action,
            plane: plane
        });

        stompClient1.send('/app/3dMode', {}, dataToSend);
        console.log('Сообщение отправлено на сервер:', dataToSend);
    }

    if (ctrlPressed) {
        if (keyPeriodPressed) {
            if (keyZPressed) {
                action = 'rotate';
                axis = 'z';
                value = 10;
            } else if (keyXPressed) {
                action = 'rotate';
                axis = 'x';
                value = 10;
            } else if (keyYPressed) {
                action = 'rotate';
                axis = 'y';
                value = 10;
            }
        }

        if (keyCommaPressed) {
            if (keyZPressed) {
                action = 'rotate';
                axis = 'z';
                value = -10;
            } else if (keyXPressed) {
                action = 'rotate';
                axis = 'x';
                value = -10;
            } else if (keyYPressed) {
                action = 'rotate';
                axis = 'y';
                value = -10;
            }
        }

        if (bracketRightPressed) {
            if (keyZPressed) {
                action = 'translate';
                variable = 'z';
                value = 50;
            } else if (keyXPressed) {
                action = 'translate';
                variable = 'x';
                value = 50;
            } else if (keyYPressed) {
                action = 'translate';
                variable = 'y';
                value = 50;
            } else if (keyCPressed) {
                action = 'scale';
                scale += 0.1;
            }
        }

        if (bracketLeftPressed) {
            if (keyZPressed) {
                action = 'translate';
                variable = 'z';
                value = -50;
            } else if (keyXPressed) {
                action = 'translate';
                variable = 'x';
                value = -50;
            } else if (keyYPressed) {
                action = 'translate';
                variable = 'y';
                value = -50;
            } else if (keyCPressed) {
                action = 'scale';
                scale -= 0.1;
            }
        }

        if (action === 'rotate' && stompClient1 && stompClient1.connected) {
            const dataToSend = JSON.stringify({
                method: action,
                keyboard: true,
                axis: axis,
                angle: value
            });

            stompClient1.send('/app/3dMode', {}, dataToSend);
            console.log('Сообщение отправлено на сервер:', dataToSend);
        }

        if (action === 'scale' && stompClient1 && stompClient1.connected) {
            const dataToSend = JSON.stringify({
                method: action
            });

            stompClient1.send('/app/3dMode', {}, dataToSend);
            console.log('Сообщение отправлено на сервер:', dataToSend);
        }

        if (action && variable && stompClient1 && stompClient1.connected) {
            const dataToSend = JSON.stringify({
                method: action,
                variable: variable,
                value: value
            });

            stompClient1.send('/app/3dMode', {}, dataToSend);
            console.log('Сообщение отправлено на сервер:', dataToSend);
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.ctrlKey) {
        ctrlPressed = false;
    }

    if (event.shiftKey) {
        shiftPressed = false;
    }

    if (event.code === 'BracketRight') {
        bracketRightPressed = false;
    }

    if (event.code === 'BracketLeft') {
        bracketLeftPressed = false;
    }

    if (event.code === 'KeyZ') {
        keyZPressed = false;
    }

    if (event.code === 'KeyX') {
        keyXPressed = false;
    }

    if (event.code === 'KeyY') {
        keyYPressed = false;
    }

    if (event.code === 'KeyC') {
        keyCPressed = false;
    }

    if (event.code === 'Period') {
        keyPeriodPressed = false;
    }

    if (event.code === 'Comma') {
        keyCommaPressed = false;
    }
});

document.getElementById('translate').addEventListener('click', () => {
    const translateModal = new bootstrap.Modal(document.getElementById('translateModal'));
    translateModal.show();
});

document.getElementById('applyTranslation').addEventListener('click', () => {
    const tx = document.getElementById('tx').value;
    const ty = document.getElementById('ty').value;
    const tz = document.getElementById('tz').value;

    const dataToSend = JSON.stringify({
        method: "translate",
        tx: tx,
        ty: ty,
        tz: tz
    });

    console.log("Translation work");
    if (stompClient1 && stompClient1.connected) {
        stompClient1.send('/app/3dMode', {}, dataToSend);
    } else {
        console.error('STOMP соединение не установлено.');
    }

    const translateModal = bootstrap.Modal.getInstance(document.getElementById('translateModal'));
    translateModal.hide();
});

document.getElementById('rotate').addEventListener('click', () => {
    const rotateModal = new bootstrap.Modal(document.getElementById('rotateModal'));
    rotateModal.show();
});

document.getElementById('applyRotate').addEventListener('click', () => {
    const rotateAxis = document.getElementById('rotateParamText').value;
    const rotateAngle = document.getElementById('rotateParamAngle').value;


    const dataToSend = JSON.stringify({
        method: "rotate",
        axis: rotateAxis,
        angle: rotateAngle
    });
    if (stompClient1 && stompClient1.connected) {
        stompClient1.send('/app/3dMode', {}, dataToSend);
    } else {
        console.error('STOMP соединение не установлено.');
    }


    const scaleModal = new bootstrap.Modal(document.getElementById('scaleModal'));
    scaleModal.hide();
});

document.getElementById('scale').addEventListener('click', () => {
    const scaleModal = new bootstrap.Modal(document.getElementById('scaleModal'));
    scaleModal.show();
});

document.getElementById('applyScale').addEventListener('click', () => {
    const scaleValue = document.getElementById('scaleParam').value;
    scale = scaleValue;
    if (!scaleValue) {
        alert('Введите значение масштаба!');
    } else {
        const dataToSend = JSON.stringify({
            method: "scale",
        });
        if (stompClient1 && stompClient1.connected) {
            stompClient1.send('/app/3dMode', {}, dataToSend);
        } else {
            console.error('STOMP соединение не установлено.');
        }
    }

    const scaleModal = new bootstrap.Modal(document.getElementById('scaleModal'));
    scaleModal.hide();
});

document.getElementById('reflect').addEventListener('click', () => {
    const reflectModal = new bootstrap.Modal(document.getElementById('reflectModal'));
    reflectModal.show();
});

document.getElementById('applyReflect').addEventListener('click', () => {
    const reflectValue = document.getElementById('reflectParam').value;
    const dataToSend = JSON.stringify({
        method: "reflect",
        plane: reflectValue
    });
    if (stompClient1 && stompClient1.connected) {
        stompClient1.send('/app/3dMode', {}, dataToSend);
    } else {
        console.error('STOMP соединение не установлено.');
    }


    const reflectModal = new bootstrap.Modal(document.getElementById('reflectModal'));
    reflectModal.hide();
});

document.getElementById('perspective').addEventListener('click', () => {
    const perspectiveModal = new bootstrap.Modal(document.getElementById('perspectiveModal'));
    perspectiveModal.show();
});

document.getElementById('applyPerspective').addEventListener('click', () => {
    const perspectiveValue = document.getElementById('perspectiveParam').value;
    const dataToSend = JSON.stringify({
        method: "perspective",
        keyboard: true,
        distance: perspectiveValue
    });
    if (stompClient1 && stompClient1.connected) {
        stompClient1.send('/app/3dMode', {}, dataToSend);
    } else {
        console.error('STOMP соединение не установлено.');
    }


    const perspectiveModal = new bootstrap.Modal(document.getElementById('perspectiveModal'));
    perspectiveModal.hide();
});

window.addEventListener('load', () => {
    connect1();
});

window.addEventListener('beforeunload', () => {
    disconnect1();
});