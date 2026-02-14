# 📞 GuruCall – Voice AI Tutor

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Groq-LLM-FF6600?style=for-the-badge" alt="Groq" />
</div>

<br />

<div align="center">
  <h3>🎓 Education as Easy as Making a Phone Call</h3>
  <p>An AI-powered voice tutor delivering instant, curriculum-aligned answers via phone</p>
</div>

---

## ⚠️ Prototype Notice

> **This is a prototype/demonstration project.** 
> 
> - 📞 **Phone numbers displayed are placeholders** - Real telephony integration requires carrier partnerships and government compliance
> - 🎤 **Web-based voice demo is fully functional** - Experience the AI tutor capabilities through your browser
> - 🏢 **Enterprise-ready architecture** - Backend designed for easy integration with telephony providers
> - 📋 **Regulatory compliance required** - Production IVR services need government approval in most jurisdictions

---

## 🌟 Vision

To build an inclusive and accessible educational platform powered by voice and AI that:

- 📚 Allows users of all literacy levels to ask academic questions in natural language
- 🎯 Delivers personalized, curriculum-aligned answers based on the learner's academic level
- 📞 Works on any basic mobile or landline — no app, no login, no internet required
- 🌍 Brings AI-powered education to rural and underconnected regions

---

## 🧠 How It Works

1. 👤 User calls the GuruCall number (or uses the web demo)
2. 📊 They select their education level using keypad input (1 to 7)
3. 🎤 They speak their academic question after the beep
4. 🧠 On the backend:
   - 📜 Recording is transcribed using **Deepgram** (Speech-to-Text)
   - 🤖 The text is processed with **Groq's Llama 3.3 70B** to generate an explanation
   - 🔊 The response is converted to audio using **ElevenLabs** (Text-to-Speech)
5. 🔁 The synthesized answer is played back to the user
6. ✅ User receives their answer — all voice, no screen!

---

## 🎓 Category Mapping

The IVR flow lets the caller select their education level by pressing a digit:

| Digit | Explanation Level                         |
|-------|-------------------------------------------|
| 1     | Class 1–5 (basic, playful explanation)     |
| 2     | Class 6–10 (school-level, relatable)       |
| 3     | Class 11–12 (conceptual, academic tone)    |
| 4     | Engineering student (technical depth)      |
| 5     | Medical student (clinical relevance)       |
| 6     | Commerce student (economics, business)     |
| 7     | Arts student (social science, creative)    |

---

## 🛠 Tech Stack

| Technology | Role |
|------------|------|
| **Cloud Telephony** | IVR menu, call flow, voice routing (carrier integration ready) |
| **Node.js + Express** | TypeScript-based REST API server |
| **Deepgram API** | Nova-2 model for speech-to-text transcription |
| **Groq LLM** | Llama 3.3 70B for lightning-fast AI responses |
| **ElevenLabs API** | Multilingual v2 for natural text-to-speech |
| **MongoDB** | User profiles and conversation history |
| **React + Vite** | Modern frontend with voice demo |
| **Tailwind CSS** | Utility-first responsive styling |
| **Framer Motion** | Smooth animations |

---

## 📁 Project Structure

```
GuruCall/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic (STT, TTS, LLM)
│   │   ├── models/         # MongoDB models
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── App.tsx         # Main application
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── server.js               # Legacy/alternate server
└── README.md               # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- API Keys for: Deepgram, Groq, ElevenLabs

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔧 Environment Variables

Create `backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gurucall

# AI Services
GROQ_API_KEY=your_groq_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/stt/transcribe` | POST | Speech-to-text |
| `/api/gemini/generate` | POST | AI response generation |
| `/api/tts/synthesize` | POST | Text-to-speech |

---

## 🎤 Voice Demo Features

The web-based voice demo includes:

- 🎯 **5 Education Levels** - Primary to Professional
- 🎤 **Real-time STT** - Deepgram Nova-2
- 🧠 **Fast AI Responses** - Groq Llama 3.3 70B
- 🔊 **Natural TTS** - ElevenLabs with browser fallback
- 💬 **Conversation History** - With replay functionality
- 📱 **Responsive Design** - Works on all devices

---

## 🔒 Security Notes

- All API keys stored in environment variables
- CORS configured for frontend origin
- Input validation on all endpoints
- No sensitive data logged

---

## 📝 License

This project is a prototype for educational demonstration purposes.

---

## 🤝 Enterprise Inquiries

Interested in deploying GuruCall with real telephony integration? The architecture is designed for easy integration with:

- Twilio
- Vonage (Nexmo)
- Plivo
- Amazon Connect
- Custom SIP providers

Contact the team for enterprise deployment options.

---

<div align="center">
  <p>Made with ❤️ for accessible education</p>
  <p><strong>GuruCall</strong> - Voice-First AI Education Platform</p>
</div>
