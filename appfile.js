const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

// Replace with your actual API key
const API_KEY = "AIzaSyB15CH4qj_uhsUrqIdV7PGedPfRt6UKzXw";
const genAI = new GoogleGenerativeAI(API_KEY);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle chat requests
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    let chatbotReply = "Sorry, I couldn't get a response. Please try again.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userMessage);

        if (result.response && result.response.text) {
            chatbotReply = result.response.text();  
        } else {
            chatbotReply = "No response from AI.";
        }
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
    }

    res.json({ userMessage, chatbotReply });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});