const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

app.post('/roblox-ai', async (req, res) => {
    const { user, message } = req.body;
    console.log(`Received message from ${user}: ${message}`);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
        
        const payload = {
            contents: [{
                parts: [{
                    text: `You are an NPC chatbot inside a Roblox game. A player named ${user} said: "${message}". Keep your response short, casual, and friendly.`
                }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ reply: replyText });
        } else {
            res.json({ reply: "Hmm, I couldn't process that!" });
        }
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ reply: "Error connecting to AI backend." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AI Proxy running on port ${PORT}`);
});
