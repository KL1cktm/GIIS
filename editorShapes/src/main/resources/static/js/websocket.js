let stompClient = null;

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

let stompClient1 = null;

function connect1() {
    const socket = new SockJS('/lab1');
    stompClient1 = Stomp.over(socket);
    stompClient1.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient1.subscribe('/topic/secondLineOrder', (message) => {
            const pointsFromServer = JSON.parse(message.body);
            checkDebugMode(pointsFromServer);
            console.log('Received points from server');
        });
    });
}

function disconnect1() {
    if (stompClient1 !== null) {
        stompClient1.disconnect();
    }
}

let stompClient2 = null;

function connect2() {
    const socket = new SockJS('/lab1');
    console.log("Socket connected!");
    stompClient2 = Stomp.over(socket);
    stompClient2.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        stompClient2.subscribe('/topic/curveLine', (message) => {
            const pointsFromServer = JSON.parse(message.body);
            console.log(pointsFromServer);
            checkDebugMode(pointsFromServer);
            console.log('Received points from server');
        });
    });
}

function disconnect2() {
    if (stompClient2 !== null) {
        stompClient2.disconnect();
    }
}

window.addEventListener('load', () => {
    connect();
    connect1();
    connect2();
});


window.addEventListener('beforeunload', () => {
   disconnect();
   disconnect1();
   disconnect2();
});