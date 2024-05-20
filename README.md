<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT Integration</title>
    <style>
        #chatbox {
            width: 100%;
            max-width: 500px;
            height: 400px;
            border: 1px solid #ccc;
            padding: 10px;
            overflow-y: scroll;
        }
        #inputBox {
            width: 100%;
            max-width: 500px;
        }
    </style>
</head>
<body>
    <div id="chatbox"></div>
    <input type="text" id="inputBox" placeholder="Type your message here...">
    <button onclick="sendMessage()">Send</button>

    <script>
        const apiKey = 'sk-steli-8lZE7QiX4iF6CuaVWxpBT3BlbkFJOnNeJJmElOerEphakGzh'; // Înlocuiește cu cheia ta API
        const chatbox = document.getElementById('chatbox');
        const inputBox = document.getElementById('inputBox');

        async function sendMessage() {
            const message = inputBox.value;
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

            chatbox.innerHTML += `<p><strong>Assistant:</strong> ${assistantMessage}</p>`;
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    </script>
</body>
</html>
