const nodemailer = require('nodemailer');

// Handler pentru API OpenAI
export default async function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("Request received:", req.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(req.body)
    });

    const data = await response.json();
    console.log("Response from OpenAI:", data);

    res.status(200).json(data);
}

// Funcția pentru afișarea formularului de rezervare
function showBookingForm() {
    return `
        <form id="bookingForm">
            <label for="nume">Nume:</label><br>
            <input type="text" id="nume" name="nume"><br>
            <label for="numar_telefon">Număr Telefon:</label><br>
            <input type="text" id="numar_telefon" name="numar_telefon"><br>
            <label for="email">Email:</label><br>
            <input type="text" id="email" name="email"><br>
            <label for="data_rezervarii">Data Rezervării:</label><br>
            <input type="date" id="data_rezervarii" name="data_rezervarii"><br>
            <label for="tip_eveniment">Tipul Evenimentului:</label><br>
            <input type="text" id="tip_eveniment" name="tip_eveniment"><br><br>
            <input type="submit" value="Trimite">
        </form>
    `;
}

// Funcția pentru trimiterea formularului prin email
async function sendForm(formData) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'Noua Rezervare',
        text: `Nume: ${formData.name}\nNumăr Telefon: ${formData.phone}\nEmail: ${formData.email}\nData Rezervării: ${formData.reservationDate}\nTipul Evenimentului: ${formData.eventType}`
    };

    await transporter.sendMail(mailOptions);
}

// Funcția pentru gestionarea trimiterea formularului
document.getElementById('bookingForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('nume').value,
        phone: document.getElementById('numar_telefon').value,
        email: document.getElementById('email').value,
        reservationDate: document.getElementById('data_rezervarii').value,
        eventType: document.getElementById('tip_eveniment').value
    };
    await sendForm(formData);
});
