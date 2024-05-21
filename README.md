<!DOCTYPE html>
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
            width: 400px; /* Adjust this value to your desired width */
            max-width: 100%;
            display: none; /* Initially hidden */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            max-height: 80vh; /* Adjust this value to your desired height */
            background-color: white;
        }
        #chatbox {
            flex-grow: 1;
            height: 500px; /* Adjust this value to your desired height */
            padding: 10px;
            overflow-y: auto;
            background-color: white;
            border-top: 1px solid #ccc;
        }
        #inputBox {
            flex-grow: 1;
            border: none;
            padding: 10px;
            border-radius: 0 0 0 10px;
            outline: none;
        }
        #chatHeader {
            display: flex;
            align-items: center;
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
            width: 80px; /* Adjust this value to your desired width */
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 0 0 10px 0;
            cursor: pointer;
            font-size: 16px; /* Adjust this value to your desired font size */
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
            display: flex;
            align-items: center;
        }
        .message p {
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
        }
        .message.user {
            justify-content: flex-end;
        }
        .message.user p {
            background-color: #dcf8c6;
        }
        .message.assistant {
            justify-content: flex-start;
        }
        .message.assistant p {
            background-color: #f1f1f1;
        }
        .typing-indicator {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
        }
        .typing-indicator .dot {
            width: 8px;
            height: 8px;
            margin: 0 2px;
            background-color: #ccc;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
        }
        .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes blink {
            0%, 80%, 100% {
                opacity: 0;
            }
            40% {
                opacity: 1;
            }
        }

        /* Media queries for mobile optimization */
        @media (max-width: 600px) {
            #chatContainer {
                width: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
                max-height: 100vh;
            }
            #chatHeader {
                padding: 5px;
            }
            #chatHeader img {
                width: 30px;
                height: 30px;
            }
            #sendButton {
                width: 80px; /* Adjust this value to your desired width */
                border-radius: 0;
                font-size: 14px; /* Adjust this value to your desired font size */
            }
        }
    </style>
</head>
<body>
    <div id="chatContainer">
        <div id="chatHeader" onclick="toggleChat()">
            <img src="ste.jpg" alt="StelminaBot">
            <span>StelminaBot</span>
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
        const apiKey = 'sk-steli-8lZE7QiX4iF6CuaVWxpBT3BlbkFJOnNeJJmElOerEphakGzh'; // Your API Key
        const assistantId = 'asst_7qogC106HaAaB90kI5PiBkNN'; // Your Assistant ID
        const chatContainer = document.getElementById('chatContainer');
        const chatbox = document.getElementById('chatbox');
        const inputBox = document.getElementById('inputBox');
        const minimizedChat = document.getElementById('minimizedChat');
        let typingIndicator;
        let threadId = null;

        function toggleChat() {
            if (chatContainer.style.display === 'none') {
                chatContainer.style.display = 'block';
                minimizedChat.style.display = 'none';
            } else {
                chatContainer.style.display = 'none';
                minimizedChat.style.display = 'flex';
            }
        }

        async function createThread() {
            const response = await fetch(`https://api.openai.com/v1/assistants/${assistantId}/threads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ title: "New Conversation" })
            });
            const data = await response.json();
            return data.id;
        }

        async function sendMessage() {
            const message = inputBox.value;
            if (!message.trim()) return;
            inputBox.value = '';
            chatbox.innerHTML += `<div class="message user"><p>${message}</p></div>`;

            showTypingIndicator();

            if (!threadId) {
                try {
                    threadId = await createThread();
                } catch (error) {
                    console.error('Error creating thread:', error);
                    removeTypingIndicator();
                    chatbox.innerHTML += `<div class="message assistant"><p>Error creating thread. Please try again later.</p></div>`;
                    return;
                }
            }

            try {
                const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo-0125",  // sau modelul pe care îl folosești
                        messages: [
                            { role: "user", content: message }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                const assistantMessage = data.choices[0].message.content;

                removeTypingIndicator();
                chatbox.innerHTML += `<div class="message assistant"><p>${assistantMessage}</p></div>`;
                chatbox.scrollTop = chatbox.scrollHeight;
            } catch (error) {
                console.error('Error sending message:', error);
                removeTypingIndicator();
                              chatbox.innerHTML += `<div class="message assistant"><p>Error sending message. Please try again later.</p></div>`;
            }
        }

        function showTypingIndicator() {
            typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
            chatbox.appendChild(typingIndicator);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        function removeTypingIndicator() {
            if (typingIndicator) {
                typingIndicator.remove();
                typingIndicator = null;
            }
        }

        // Function to open chat automatically with an initial message
        async function openChatWithInitialMessage() {
            toggleChat();
            if (!threadId) {
                threadId = await createThread();
            }
            chatbox.innerHTML += `<div class="message assistant"><p>Bună, eu sunt AI Stelmina, cu ce informații vă pot ajuta?</p></div>`;
        }

        // Automatically open chat after 2 seconds
        window.onload = function() {
            chatContainer.style.display = 'none';
            minimizedChat.style.display = 'flex';

            setTimeout(() => {
                openChatWithInitialMessage();
            }, 2000);
        };
    </script>
</body>
</html>
