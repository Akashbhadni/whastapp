const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const base64Data = reader.result;
        const fileType = file.type.startsWith('image') ? 'image' : 'video';

        const msg = {
            user: name,
            type: fileType,
            data: base64Data
        };

        appendMessage(msg, 'outgoing');
        socket.emit('media', msg);
    };
    reader.readAsDataURL(file);
});

socket.on('media', (msg) => {
    appendMessage(msg, 'incoming');
});

function appendMessage(msg, type) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message');

    let content = `<h4>${msg.user}</h4>`;

    if (msg.type === 'image') {
        content += `<img src="${msg.data}" alt="Image" style="max-width: 200px;" />`;
    } else if (msg.type === 'video') {
        content += `<video controls style="max-width: 200px;">
                        <source src="${msg.data}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>`;
    } else {
        content += `<p>${msg.message}</p>`;
    }

    mainDiv.innerHTML = content;
    messageArea.appendChild(mainDiv);
    scrollToBottom();
}


