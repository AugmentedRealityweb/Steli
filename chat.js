// chat.js
const showBookingForm = () => `
    <form id="bookingForm">
        <label for="nume">Nume:</label><br>
        <input type="text" id="nume" name="nume"><br>
        <label for="numar_telefon">Număr Telefon:</label><br>
        <input type="text" id="numar_telefon" name="numar_telefon"><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br>
        <label for="data_rezervarii">Data Rezervării:</label><br>
        <input type="date" id="data_rezervarii" name="data_rezervarii"><br>
        <label for="tip_eveniment">Tipul Evenimentului:</label><br>
        <input type="text" id="tip_eveniment" name="tip_eveniment"><br><br>
        <input type="submit" value="Trimite">
    </form>
`;

export default async function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        const assistantMessage = data.choices[0].message.content;

        if (assistantMessage.toLowerCase().includes("booking request")) {
            res.status(200).json({ 
                choices: [{ message: { content: showBookingForm() } }] 
            });
        } else {
            res.status(200).json(data);
        }
    } else {
        res.status(500).json({ error: 'Failed to get a response from OpenAI' });
    }
}
