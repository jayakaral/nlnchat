const socket = io();
let name;
const sendbtn = document.getElementById('send-btn');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
// var audio = new Audio('ting.mp3');
do {
    name = prompt('Please enter your name: ')
} while (!name)

const append = (cname, message, position) => {
    const d = new Date();
    let lt = d.toLocaleTimeString();
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<h5>${cname} | ${lt}</h5><p>${message}</p>`;
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
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';

};

sendbtn.addEventListener('click', () => {
    const message = messageInput.value;
    append(`${name}`, `${message}`, 'right');
    socket.emit('send', message);
    sendbtn.style.display = "none";
    messageInput.value = "";
    messageInput.style.height = '43px';
    scrollToBottom();
})


socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name}`, `${name} joined the chat`, 'right');
    scrollToBottom();
});

socket.on('receive', data => {
    append(`${data.name}`, `${data.message}`, 'left');
    scrollToBottom();
});

socket.on('left', name => {
    append(`${name}`, `${name} left the chat`, 'right');
    scrollToBottom();
});

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight
}
