const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    const { name, phone, email, reservationDate, eventType } = req.body;

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
        text: `Nume: ${name}\nNumăr Telefon: ${phone}\nEmail: ${email}\nData Rezervării: ${reservationDate}\nTipul Evenimentului: ${eventType}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email trimis cu succes' });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la trimiterea emailului' });
    }
}
