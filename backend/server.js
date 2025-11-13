require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
const FRONTEND_URL1 = process.env.FRONTEND_URL1;
const FRONTEND_URL2 = process.env.FRONTEND_URL2;

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL1,
      process.env.FRONTEND_URL2
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

const HuggingFace_API_KEY = process.env.HF_API_KEY;

// preferred model
const HF_MODEL = "openai/gpt-oss-120b:fastest"; 
// Alternatives:
// const HF_MODEL = "zai-org/GLM-4.5:novita";
// const HF_MODEL = "google/gemma-2-2b-it";
// const HF_MODEL = "Qwen/Qwen2.5-7B-Instruct-1M";

if (!HuggingFace_API_KEY) {
  console.error("❌ Missing HuggingFace_API_KEY");
  process.exit(1);
}


app.get("/study", async (req, res) => {
  const { topic, mode } = req.query;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }
  // Fetch from Wikipedia
  let wiki;
  try {
    const URL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      topic.toLowerCase()
    )}`;
    wiki = await axios.get(URL, {
      headers: {
        "User-Agent": "SmartStudyAssistant/1.0",
        Accept: "application/json",
      },
    });
  } catch (err) {
    return res.status(404).json({
      error: "Failed to fetch Wikipedia summary",
      status: err.response?.status,
    });
  }
  const extract = wiki.data.extract;
  if (!extract || extract.length < 20) {
    return res.status(404).json({ error: "No valid summary found" });
  }
  const shortExtract = extract.substring(0, 600);
  // Build prompt
  let promptContent = `Given this content about "${topic}":
"${shortExtract}"

Return ONLY a JSON object in this format:
{
  "summary": ["point 1", "point 2", "point 3"],
  "quiz": [
    {"question": "question 1?", "options": ["A","B","C","D"], "correct": "A"},
    {"question": "question 2?", "options": ["A","B","C","D"], "correct": "B"},
    {"question": "question 3?", "options": ["A","B","C","D"], "correct": "C"}
  ],
  "studyTip": "one helpful study tip"${mode === "math" ? `,
  "mathQuant": {
    "question": "",
    "answer": "",
    "explanation": ""
  }` : ""}
}
Respond ONLY with JSON. No Markdown.`;

  // Main HF API Call
  let aiResponse = "";
  try {
    const result = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: HF_MODEL,
        messages: [{ role: "user", content: promptContent }],
        max_tokens: 700,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${HuggingFace_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 40000,
      }
    );
    aiResponse = result.data.choices[0].message.content;

    // Clean + extract possible JSON
    aiResponse = aiResponse.replace(/``````/g, '').trim();
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) aiResponse = jsonMatch[0];

    try {
      const parsed = JSON.parse(aiResponse);
      return res.json(parsed);
    } catch (err) {
      // If parsing fails, fallback below
    }
  } catch (err) {
    console.log("HF Error:", err.response?.data || err.message);
  }

  // Fallback if API or parsing fails
  return res.json({
    summary: [
      shortExtract.substring(0, 100),
      shortExtract.substring(100, 220),
      shortExtract.substring(220, 340)
    ],
    quiz: [
      {
        question: `What is ${topic}?`,
        options: ["A. See summary", "B. Unknown", "C. Maybe", "D. Other"],
        correct: "A"
      },
      {
        question: `Learn more about ${topic}?`,
        options: ["A. Yes", "B. No", "C. Maybe", "D. Later"],
        correct: "A"
      },
      {
        question: `Is ${topic} interesting?`,
        options: ["A. Very", "B. Somewhat", "C. Not really", "D. No"],
        correct: "A"
      }
    ],
    studyTip: `Review the summary points about ${topic}.`,
    ...(mode === "math" && {
      mathQuant: {
        question: "What is 2 + 2?",
        answer: "4",
        explanation: "It's basic arithmetic.",
      }
    })
  });
});


app.get("/", (req, res) => {
  res.send("Smart Study Assistant API (HuggingFace Router, latest models) 🚀");
});

const PORT = 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (model ${HF_MODEL})`));
