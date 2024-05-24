// send-email.js
const nodemailer = require('nodemailer');

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
        text: `Nume: ${formData.nume}\nNumăr Telefon: ${formData.numar_telefon}\nEmail: ${formData.email}\nData Rezervării: ${formData.data_rezervarii}\nTipul Evenimentului: ${formData.tip_eveniment}`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendForm };
