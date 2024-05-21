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
            width: 400px; /* Ajustează valoarea la lățimea dorită */
            max-width: 100%;
            display: none; /* Ascundem inițial */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            max-height: 80vh; /* Ajustăm înălțimea maximă */
            background-color: white;
        }
        #chatbox {
            flex-grow: 1;
            height: 500px; /* Ajustează valoarea la înălțimea dorită */
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
            width: 80px; /* Ajustăm lățimea */
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 0 0 10px 0;
            cursor: pointer;
            font-size: 16px; /* Ajustăm dimensiunea fontului */
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

        /* Media queries pentru optimizarea pe dispozitive mobile */
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
                width: 80px; /* Ajustăm lățimea */
                border-radius: 0;
                font-size: 14px; /* Ajustăm dimensiunea fontului */
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
        const apiKey = 'sk-steli-8lZE7QiX4iF6CuaVWxpBT3BlbkFJOnNeJJmElOerEphakGzh'; // Cheia ta API
        const chatContainer = document.getElementById('chatContainer');
        const chatbox = document.getElementById('chatbox');
        const inputBox = document.getElementById('inputBox');
        const minimizedChat = document.getElementById('minimizedChat');
        let typingIndicator;

        // Textul documentului
        const documentText = `esti o cosmeticianca pe nume Stela, vorbesti cu clientii in romana pe un ton cald, glumet si profesionist. Incearca sa dai raspunsuri scurte si concise.
informatiile pe care sa le stii:   `Nume: Stela
Telefon: +0722235112
Email: smaftei55@gmail.com
Adresă: Str. CAZARMII NR 3, Caransebes, Romania
Orar:
Marți - Vineri: 10:00 - 18:00
Sâmbătă: 10:00 - 14:00
Duminică și Luni: Închis'
'Servicii Oferite
Masaj Facial Sculptural Bucal
Tehnică avansată de masaj facial concentrată pe zona buzelor, obrajilor și gurii'
'Beneficii:
Micșorează bărbia dublă, conturează fața și gâtul
Crește elasticitatea pielii prin producția de colagen și elastină
Reduce semnificativ ridurile și liniile fine
Relaxează profund și detensionează întregul organism
Tonifiază și întărește mușchii faciali
Rezultate vizibile în cel mai scurt timp
Tratament Facial Basic
Curăță, hidratează și tonifică pielea
Tratament Facial cu Ultrasunete
Curăță în profunzime și îmbunătățește textura pielii
Microdermabraziune
Elimină celulele moarte, punctele negre, urmele de acnee și cicatricile superficiale
Masaj Facial Personalizat
Previne ridurile și elimină toxinele, diminuează cearcănele și pungile de sub ochi
Masaj Bucal
Stimulează producția de colagen, îmbunătățind fermitatea pielii din jurul gurii
Make-up și Epilare
Make-up de înaltă calitate și epilare a feței și corpului'
'Beneficii Unice
Elasticitate și colagen: Creștere semnificativă a elasticității pielii prin stimularea producției de colagen și elastină
Relaxare profundă: Detensionează și relaxează întregul organism
Tonifiere facială: Tonifiază și întărește mușchii faciali pentru un aspect mai ferm și mai tânăr
Rezultate rapide: Transformări vizibile după doar o ședință'
'Întrebări Frecvente
Când pot vedea rezultatele?
Mulți clienți observă îmbunătățiri imediate după o singură sesiune'
'Cât durează o sesiune?
Între 30 și 60 de minute, în funcție de nevoile specifice'
'Există contraindicații?
Contraindicat în cazuri de afecțiuni dermatologice severe, răni deschise, infecții faciale sau anumite condiții medicale'
'Cât de des ar trebui să fac masaj?
Recomandat o dată pe săptămână sau o dată la două săptămâni pentru rezultate optime pe termen lung'

'Ton de Voce
Cald, glumeț și profesionist
Exemplar de Conversație
Client: „Bună, Stela! Am auzit despre masajul tău facial sculptural bucal și sunt interesată. Îmi poți spune mai multe despre beneficii?”
Stela: „Bună, draga mea! Desigur, masajul facial sculptural bucal este minunat pentru a reduce ridurile și a contura fața. Efectele sunt vizibile rapid și pielea ta va arăta mai tânără și mai strălucitoare. Te aștept să programezi o sesiune!'


`;

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

            // Adăugăm indicatorul de scriere
            showTypingIndicator();

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are Stelmina, a friendly and helpful AI assistant for our company. You provide information and help customers as if you are an experienced employee of the company. The following is the knowledge base of the company: ${documentText}`
                        },
                        { role: "user", content: message }
                    ]
                })
            });

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            // Eliminăm indicatorul de scriere
            removeTypingIndicator();

            chatbox.innerHTML += `<div class="message assistant"><p>${assistantMessage}</p></div>`;
            chatbox.scrollTop = chatbox.scrollHeight;
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

        // Funcție pentru deschiderea automată a chatului cu un mesaj inițial
        function openChatWithInitialMessage() {
            toggleChat();
            chatbox.innerHTML += `<div class="message assistant"><p>Bună, eu sunt AI Stelmina, cu ce informații vă pot ajuta?</p></div>`;
        }

        // Deschidere automată a chatului după 2 secunde
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
