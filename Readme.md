# Smart Study Assistant

Smart Study Assistant is a full-stack web app that helps students learn smarter using AI.
A user enters a topic → the backend fetches Wikipedia data → the AI generates a summary, quiz, study tip, and optional math question → the frontend displays everything.

---

## Hosted URLs

Frontend (Vercel): https://smart-study-assistant-chi.vercel.app
Backend (Render): https://smart-study-assistant-72fx.onrender.com

<a href="https://smart-study-assistant-chi.vercel.app" target="_blank">
Open Frontend (Vercel)
</a>

---

# Features

## Backend Features

- Endpoint: `/study?topic=<topic>&mode=<standard|math>`
- Fetches real public data using the Wikipedia REST API
- Uses HuggingFace AI model to generate structured learning output:
  - Three summary points
  - Three MCQ quiz questions
  - One study tip
  - Optional math/logic question when `mode=math`
- Responds with strict JSON only (no text outside JSON)
- Auto fallback mode when AI fails or returns invalid JSON
- Proper CORS setup for Vercel frontend + localhost development

## Frontend Features

- Built using React + Vite
- Topic input + optional Math Mode toggle
- Displays:
  - Summary
  - MCQ quiz (correct answers highlighted)
  - Study tip
  - Math question, answer, and explanation (only in math mode)
- Includes loading state and error handling
- Saves topic history in localStorage
- Clean and responsive UI
