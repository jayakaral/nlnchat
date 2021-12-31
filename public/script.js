const socket = io();

//var username = location.search.substr(6);
var username = new URLSearchParams(window.location.search).get('Name');
var container = document.querySelector('.container');
var users_list = document.querySelector('.users-list');
var users_count = document.querySelector('.users-count');
var msg_send = document.querySelector('#send-btn');
var user_msg = document.querySelector('#messageInp');
var activeusers = document.querySelector('.activeusers');
var progressbar = document.querySelector('#progressbar');

// do {
//     username = prompt('Please enter your name to chat: ')
// } while (!username);


progressbar.style.height = Math.floor(container.offsetHeight / container.scrollHeight * container.offsetHeight) + 'px';

container.onscroll = scrollbar;

function scrollbar() {
    var progressbar = document.querySelector('#progressbar');
    let barHeight = container.offsetHeight / container.scrollHeight * container.offsetHeight;
    progressbar.style.height = barHeight + 'px';
    let nh = (container.offsetHeight / (container.scrollHeight - container.scrollTop) * container.offsetHeight) - (barHeight)
    progressbar.style.top = nh + 'px';
}

user_msg.focus();

user_msg.oninput = () => {
    msg_send.style.display = user_msg.value.trim() ? 'block' : 'none';
    user_msg.style.height = 'auto';
    user_msg.style.height = user_msg.scrollHeight + 'px';
    container.scrollTop = container.scrollHeight;
};

users_count.addEventListener('click', () => {
    activeusers.classList.toggle('active');
});

//It will be called when user will join
socket.emit('new-user-joined', username);

//notifying that user is joined
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

// function to create joined/left status div
userJoinLeft = (name, status) => {
    const d = new Date();
    let lt = d.toLocaleTimeString();
    const div = document.createElement('div');
    div.innerHTML = `<b>${lt} | </b>${name} ${status} the chat`;
    div.classList.add('user-join', status);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    scrollbar();
}

//notifying that user is left
socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'left');
});

//for updating users list and user counts
socket.on('user-list', (users) => {
    users_list.innerHTML = '';
    users_arr = Object.values(users);
    for (let i = 0; i < users_arr.length; i++) {
        let p = document.createElement('li');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerHTML = users_arr.length;
});

// for sending messages
msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value.trim()
    };
    if (user_msg.value.trim()) {
        appendMessage(data, 'right');
        socket.emit('message', data)
        user_msg.value = '';
        user_msg.focus();
    };
    msg_send.style.display = "none";
    user_msg.style.height = 'auto';
});

//for sending media
const file = document.getElementById("inputFileToLoad");
file.addEventListener("change", ev => {
    const formdata = new FormData()
    formdata.append("image", ev.target.files[0])
    fetch("https://api.imgur.com/3/image/", {
        method: "post",
        headers: {
            Authorization: "Client-ID c6b6249f1e14c80"
        },
        body: formdata
    }).then(data => data.json()).then(data => {
        var img = document.createElement('img');
        img.src = data.data.link
        var data = {
            user: username,
            msg: img.outerHTML
        };
        appendMessage(data, 'right');
        socket.emit('message', data);
    });
});

appendMessage = (data, status) => {
    const d = new Date();
    let lt = d.toLocaleTimeString();
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `<h5>${data.user} | ${lt}</h5><p>${data.msg}</p>`;
    div.innerHTML = content;
    addChat(div.outerHTML);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    scrollbar();
};

addChat = chat => {
    let notes = localStorage.getItem("notes");
    notesObj = notes ? JSON.parse(notes) : [];
    notesObj.push(chat);
    localStorage.setItem("notes", JSON.stringify(notesObj));
}

showChat = () => {
    let notes = localStorage.getItem("notes");
    notesObj = notes ? JSON.parse(notes) : [];

    let html = "";
    notesObj.forEach(function(element) {
        html += `${element}`;
    });

    if (notesObj.length != 0) {
        container.innerHTML += `${html}`;
        scrollbar();
        container.scrollTop = container.scrollHeight;
    }
}
showChat();
socket.on('message', (data) => {
    appendMessage(data, 'left');
});