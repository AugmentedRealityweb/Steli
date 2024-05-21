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
informatiile pe care sa le stii: telefon: +0722235112  Experiența Unică a Masajului Facial Sculptural Bucal Descoperă arta transformării feței tale prin tehnici avansate de masaj facial sculptural bucal. Eliberează-ți frumusețea interioară și redescoperă strălucirea și vitalitatea pielii tale. Programează un masajAflă mai multe Inovație și Transformare: Masajul Facial Sculptural Bucal Este o tehnică avansată de masaj facial, concentrată în special pe zona buzelor, obrajiilor și gurii, care are scopul de a sculpta și întineri aspectul feței. Această tehnică de masaj este creată pentru a îmbunătăți contururile feței și a atenua semnele îmbătrânirii. Tehnicile folosite în acest tip de masaj pot ajunge la straturi mai profunde ale pielii și ale mușchilor, având un efect mai profund și mai durabil asupra aspectului feței. Eu o consider o alternativă naturală și mult mai ieftină a injecțiilor cu botox. Datorită accentului pe modelarea feței și îmbunătățirea conturului, rezultatele masajului facial sculptural bucal pot fi mai vizibile și mai rapide decât în cazul altor masaje. Beneficii Unice ale Masajului Sculptural Pășește într-o lume a transformării și frumuseții autentice, descoperind avantajele inegalabile ale masajului facial sculptural bucal. De la un plus de elasticitate la reducerea vizibilă a ridurilor, această tehnică aduce o imediată schimbare pielii tale. 1. Micșorează bărbia dublă, conturează fața și gâtul 2. Crește elasticitatea pielii prin producția de colagen și elastină 3. Reduce semnificativ ridurile și liniile fine 4. Relaxează profund și detensionează întregul organism 5. Tonifiază și întărește mușchii faciali 6. Rezultate vizibile în cel mai scurt timp Înainte și După Masajul Facial Sculptural Bucal Aceste fotografii subliniază transformările subtile, dar evidente, pe care le poți obține după o singură ședință. Contururi împrospătate, o piele mai radiantă și o senzație generală de bine. Linii Fine Estompate În urma unei singure ședințe clienta mea a putut vedea o schimbare radicală a liniilor fine din jurul gurii. Piele Mai Fermă Pleoape mai ferme și liniile fine din jurul ochilor estompate semnificativ, oferind un aspect proaspăt și odihnit ochilor. Transformare Profundă a Feței Observă cum linii adânci și definite dinaintea masajului aproape că dispar în urma sesiunii de masaj facial sculptural bucal, făcând clienta mult mai fericită. Ce Spun Clientele Recomand, este un masaj foarte eficient! Ioana Dragomir Este super, recomand cu încredere. Brezoi Elena Recomand cu toată încrederea acest masaj facial sculptural! Georgeta Gorgan Bine ai venit la salon StelMina Numele meu este Stela și cu o pasiune dedicată artei masajului facial, sunt aici pentru a-ți oferi o experiență de neuitat. Cu ani de experiență și formare specializată, sunt devotată să îmbunătățesc aspectul feței tale prin metode non-invazive și terapeutice. Fiecare sesiune este personalizată pentru a se potrivi nevoilor unice ale pielii tale. Sunt nerăbdătoare să te cunosc și să începem călătoria spre o piele mai radiantă și o încredere crescută în frumusețea ta naturală. Pentru întrebări, programări sau pentru a discuta cum pot personaliza un tratament pentru tine, te invit să mă contactezi. Programează un masaj Servicii Pentru O Îngrijire Completă Bun venit în universul înfrumusețării, unde fiecare serviciu este o invitație să te răsfeți și să te simți în largul tău. Aici ai o selecție de servicii create cu dragoste și atenție, pentru ca tu să te simți minunat în pielea ta, în fiecare zi. 1. Tratament Facial Basic Descoperă esența îngrijirii cu tratamentul facial basic. O experiență delicată și personalizată care curăță, hidratează și tonifică pielea, oferindu-i un aspect proaspăt și revigorat. 2. Tratament Facial cu Ultrasunete Adu-ți pielea la nivelul următor cu tratamentul facial cu ultrasunete. Tehnologia avansată curăță în profunzime și îmbunătățește textura pielii, lăsându-ți tenul radiant și catifelat. 3. Microdermabraziune Această tehnică delicată elimină celulele moarte și îmbunătățește elasticitatea pielii, lăsându-ți chipul mai neted și proaspăt. Elimină punctele negre, urmele de acnee și cicatriciile superficiale. 4. Masaj Facial Personalizat Masajul facial este poate cel mai relaxant tratament facial. Previne apariția ridurilor și ajută la eliminarea toxinelor printr-o mai bună oxigenare a tenului, diminuează cearcănele și pungile de sub ochi. 5. Masaj Bucal Masajul bucal contribuie la circulația sângelui și stimulează producția de colagen, îmbunătățind astfel aspectul și fermitatea pielii din jurul gurii. 6. Make-up și epilare Completează-ți look-ul cu make-up de înaltă calitate, creat special pentru a sublinia frumusețea ta naturală. Descoperă de asemenea și senzația de piele catifelată prin epilarea feței dar și a corpului. Începe Drumul Spre Transformare: Programează-te Astăzi Sunt aici pentru tine în fiecare etapă a călătoriei tale către o frumusețe mai strălucitoare și încredere sporită în tine. Împărtășesc cu entuziasm expertiza mea în masajul facial sculptural bucal, dar și în celelalte servicii pe care le ofer. Indiferent dacă ai întrebări, dorești să afli mai multe despre beneficiile masajului sau să programezi o ședință, te invit să intri în contact cu mine. Răspund cu drag la orice întrebare și ofer toate detaliile necesare. Ține minte că frumusețea ta merită cele mai bune tratamente și soluții pentru ca tu să te simți minunat. +07 22 235 112 smaftei55@gmail.com Str. CAZARMII NR 3, Caransebes, Romania Facebook Cele mai frecvente întrebări Dacă întrebarea ta nu se regăsește aici, nu ezita să mă contactezi pentru a primi răspunsuri personalizate. Sunt aici pentru a te ajuta să înțelegi mai bine cum masajul facial sculptural bucal poate contribui la frumusețea și încrederea ta. Când pot vedea rezultatele masajului facial sculptural bucal? Mulți clienți observă îmbunătățiri imediate în aspectul pielii după o singură sesiune de masaj facial sculptural bucal. Linii fine pot fi estompate, contururile pot deveni mai definite, iar pielea poate avea un aspect mai strălucitor. Cât durează o sesiune de masaj facial sculptural bucal? Durata unei sesiuni de masaj facial sculptural bucal poate varia în funcție de nevoile tale specifice și de pachetul ales. În general, sesiunile pot dura între 30 și 60 de minute. Există contraindicații pentru acest masaj? Masajul facial sculptural bucal este în general sigur și non-invaziv. Cu toate acestea, există contraindicații în cazuri ca afecțiuni dermatologice severe, răni deschise sau infecții în zona feței, sau anumite condiții medicale. Înainte de a începe o sesiune, vom discuta cu tine despre starea ta de sănătate pentru a ne asigura că masajul este potrivit pentru tine. Cât de des ar trebui să fac masaj facial sculptural bucal? În general, pentru a vedea rezultate semnificative pe termen lung, este recomandat să urmezi o serie inițială de sesiuni regulate, de exemplu, o dată pe săptămână sau o dată la două săptămâni. Acest site utilizează cookie-uri pentru a îmbunătăți experiența utilizatorului. Vedeți ce fel de cookies folosim în Politica Cookie. Accept Răsfăț total pentru suflet și piele la StelMina Beauty Salon - Redescoperă-ți frumusețea naturală StelMina Beauty @ 2023. Toate drepturile rezervate. GDPR CreditsPolitică cookiePolitică de confidențialitate Legal ANPCANSPDCP Orar Marți - Vineri: 10:00 - 18:00 Sâmbătă: 10:00 - 14:00 Duminică și Luni: Închis

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
