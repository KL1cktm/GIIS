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

window.addEventListener('load', connect);

window.addEventListener('beforeunload', disconnect);