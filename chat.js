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

// Funcția pentru trimiterea formularului prin email
async function sendForm(formData) {
    let transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: 'Cerere Rezervare',
        text: `Nume: ${formData.name}\nNumăr Telefon: ${formData.phone}\nEmail: ${formData.email}\nData Rezervării: ${formData.reservationDate}\nTipul Evenimentului: ${formData.eventType}`
    };

    await transporter.sendMail(mailOptions);
}
