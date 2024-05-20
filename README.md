<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT Integration</title>
    <style>
        #chatContainer {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            max-width: 100%;
        }
        #chatbox {
            width: 100%;
            height: 400px;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: scroll;
            display: none;
            background-color: white;
            border-radius: 10px;
        }
        #inputBox {
            width: 100%;
        }
        #chatHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            cursor: pointer;
        }
        #profilePic {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }
        #toggleButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div id="chatContainer">
        <div id="chatHeader" onclick="toggleChat()">
            <img id="profilePic" src="ste.jpg" alt="StelminaBot">
            <span>StelminaBot</span>
        </div>
        <div id="chatbox"></div>
        <input type="text" id="inputBox" placeholder="Type your message here..." onkeydown="if(event.key === 'Enter') sendMessage()">
        <button onclick="sendMessage()">Send</button>
    </div>
    <button id="toggleButton" onclick="toggleChat()">+</button>

    <script>
        const apiKey = 'sk-steli-8lZE7QiX4iF6CuaVWxpBT3BlbkFJOnNeJJmElOerEphakGzh'; // Înlocuiește cu cheia ta API
        const chatbox = document.getElementById('chatbox');
        const inputBox = document.getElementById('inputBox');
        const chatContainer = document.getElementById('chatContainer');
        const toggleButton = document.getElementById('toggleButton');

        function toggleChat() {
            if (chatbox.style.display === 'none') {
                chatbox.style.display = 'block';
                inputBox.style.display = 'block';
                toggleButton.style.display = 'none';
            } else {
                chatbox.style.display = 'none';
                inputBox.style.display = 'none';
                toggleButton.style.display = 'block';
            }
        }

        async function sendMessage() {
            const message = inputBox.value;
            if (!message.trim()) return;
            inputBox.value = '';
            chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

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

            chatbox.innerHTML += `<p><strong>StelminaBot:</strong> ${assistantMessage}</p>`;
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    </script>
</body>
</html>
