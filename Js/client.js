const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('ring.mp3');



const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});
    
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});


socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left');
});


socket.on('left', (name) => {
    append(`${name} left the chat`, 'right');
});
// ... (existing code)

// Initiate audio call
function callUser(socketId) {
    const peerConnection = new RTCPeerConnection();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });

            peerConnection.createOffer()
                .then((offer) => {
                    return peerConnection.setLocalDescription(new RTCSessionDescription(offer));
                })
                .then(() => {
                    socket.emit('call-user', {
                        offer: peerConnection.localDescription,
                        to: socketId
                    });
                });
        })
        .catch((err) => {
            console.error('Error accessing user media:', err);
        });
}



