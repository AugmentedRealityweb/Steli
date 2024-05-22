// chat.js
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
