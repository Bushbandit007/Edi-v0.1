const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ✅ Chat endpoint using GPT-3.5-Turbo
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 💡 Switched from gpt-4o to gpt-3.5-turbo
      messages: messages,
    });

    res.json({ reply: completion.choices[0].message });
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    res.status(500).json({ error: "Something went wrong with the AI backend." });
  }
});

// ✅ Test endpoint (optional)
app.get("/test", async (req, res) => {
  try {
    const models = await openai.models.list();
    res.json(models.data);
  } catch (err) {
    console.error("API connection error:", err);
    res.status(500).send("API call failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

