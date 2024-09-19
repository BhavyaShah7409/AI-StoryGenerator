
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-story', async (req, res) => {
    const { genre, words } = req.body;
    const prompt = `Write a ${words}-word story in the ${genre} genre.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Check for safety violations explicitly
        if (result.candidates && result.candidates[0].safetyMetadata && result.candidates[0].safetyMetadata.blocked) {
            res.status(400).json({ error: 'The content could not be generated due to safety concerns.' });
        } else {
            res.json({ story: text });
        }
    } catch (error) {
        console.error('Error generating story:', error);
        // Check if the error is specifically due to safety concerns
        if (error.message.includes('SAFETY')) {
            res.status(400).json({ error: 'The content could not be generated due to safety concerns.' });
        } else {
            res.status(500).json({ error: 'Failed to generate story.' });
        }
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
