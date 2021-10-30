const socket = io();

const sendbtn = document.getElementById('send-btn');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
// var audio = new Audio('ting.mp3');
const name = prompt("enter your name to join");


const append = (cname, message, position) => {
    const d = new Date();
    let lt = d.toLocaleTimeString();
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<h5>${cname} ${lt}</h5><p>${message}</p>`;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // if (position == 'left') {
    //     audio.play();
    // }
}

messageInput.oninput = () => {
    if (messageInput.value == "") {
        sendbtn.style.display = "none";
    } else {
        sendbtn.style.display = "block";
    }
};

sendbtn.addEventListener('click', () => {
    const message = messageInput.value;
    append(`${name}`, `${message}`, 'right');
    socket.emit('send', message);
    sendbtn.style.display = "none";
    messageInput.value = "";
})


socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name}`, `${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}`, `${data.message}`, 'left');
});
socket.on('left', name => {
    append(`${name}`, `${name} left the chat`, 'right');
});
