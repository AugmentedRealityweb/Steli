<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT Integration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        #chatContainer {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-width: 100%;
            display: none; /* Ascundem inițial */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            overflow: hidden;
        }
        #chatbox {
            width: 100%;
            height: 400px;
            padding: 10px;
            overflow-y: scroll;
            background-color: white;
            border-top: 1px solid #ccc;
        }
        #inputBox {
            width: calc(100% - 50px);
            border: none;
            padding: 10px;
            border-radius: 0 0 0 10px;
            outline: none;
        }
        #chatHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            cursor: pointer;
        }
        #chatHeader img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
        #chatHeader span {
            font-weight: bold;
            flex-grow: 1;
        }
        #sendButton {
            width: 50px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 0 0 10px 0;
            cursor: pointer;
        }
        #minimizedChat {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #4CAF50;
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
        }
        #minimizedChat img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        .message {
            margin: 10px 0;
        }
        .message p {
            background-color: #f1f1f1;
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
        }
        .message.user p {
            background-color: #dcf8c6;
            align-self: flex-end;
        }
        .message.assistant p {
            background-color: #f1f1f1;
            align-self: flex-start;
        }
    </style>
</head>
<body>
    <div id="chatContainer">
        <div id="chatHeader" onclick="toggleChat()">
            <img src="ste.jpg" alt="StelminaBot">
            <span>StelminaBot</span>
            <span onclick="toggleChat()" style="cursor:pointer;">&times;</span>
        </div>
        <div id="chatbox"></div>
        <div style="display: flex;">
            <input type="text" id="inputBox" placeholder="Scrie mesajul tau aici..." onkeydown="if(event.key === 'Enter') sendMessage()">
            <button id="sendButton" onclick="sendMessage()">Send</button>
        </div>
    </div>
    <div id="minimizedChat" onclick="toggleChat()">
        <img src="ste.jpg" alt="StelminaBot">
    </div>

    <script>
        const apiKey = 'sk-steli-8lZE7QiX4iF6CuaVWxpBT3BlbkFJOnNeJJmElOerEphakGzh'; // Cheia ta API
        const chatContainer = document.getElementById('chatContainer');
        const chatbox = document.getElementById('chatbox');
        const inputBox = document.getElementById('inputBox');
        const minimizedChat = document.getElementById('minimizedChat');

        function toggleChat() {
            if (chatContainer.style.display === 'none') {
                chatContainer.style.display = 'block';
                minimizedChat.style.display = 'none';
            } else {
                chatContainer.style.display = 'none';
                minimizedChat.style.display = 'flex';
            }
        }

        async function sendMessage() {
            const message = inputBox.value;
            if (!message.trim()) return;
            inputBox.value = '';
            chatbox.innerHTML += `<div class="message user"><p>${message}</p></div>`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: message}]
                })
            });

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            chatbox.innerHTML += `<div class="message assistant"><p>${assistantMessage}</p></div>`;
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    </script>
</body>
</html>
