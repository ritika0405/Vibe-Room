const socket = io('https://vibe-room-p6u61jz0c-ritika-kumaris-projects.vercel.app');

//Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio('sound.mp3');

//Function which will append event info to the container
const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    audio.play();
}

//Ask new user for name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name); //emit an event

//If a new user joins, receive the name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right');
});

//If server send a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
});

//If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right');
});

//If the form gets submitted, send message to the server
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value='';
});