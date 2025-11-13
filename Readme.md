# 📘 Smart Study Assistant – Full-Stack AI-Powered 2-Day Challenge

A mini full-stack AI learning tool that helps students study smarter.  
Users enter a topic → backend fetches Wikipedia → AI summarizes it → frontend displays summary, quiz, study tip, and optional math question.

---

##  Hosted URLs

> Replace these with deployed URLs.

- **Frontend (Vercel):** https://smart-study-assistant-chi.vercel.app  
- **Backend (Render):** https://smart-study-assistant-72fx.onrender.com  

---

---

# 🔥 Features

### ✔ Backend
- Endpoint: `/study?topic=<topic>&mode=<standard|math>`
- Fetches live topic summary from **Wikipedia API**
- Uses **AI model (HuggingFace)** to create:
  - 3-bullet **summary**
  - 3 **multiple choice questions**
  - 1 **study tip**
  - **mathQuant** (if `mode=math`)
- Ensures valid JSON output
- Handles malformed AI responses using fallback questions
- Supports CORS for Vercel + localhost

### ✔ Frontend
- React + Vite SPA
- Topic input + optional **Math Mode toggle**
- Displays:
  - Summary points  
  - Quiz with correct answers highlighted  
  - Study tip  
  - Math question + explanation
- Loading and error handling
- Saves history in `localStorage`
- Clean UI design

---

# ⚙ Setup Instructions

## 🔑 Requirements
- Node.js 18+
- Git
- HuggingFace/OpenAI/Gemini API Key (choose one)

---