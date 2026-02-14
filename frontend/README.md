# GuruCall Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
</div>

<br />

<div align="center">
  <h3>🎓 Voice-First AI Education Platform</h3>
  <p>A modern, accessible web interface for the GuruCall AI tutoring system</p>
</div>

---

## ⚠️ Prototype Notice

**This is a prototype/demonstration project.** The voice demo on the website simulates how the full telephony-based system would work. Key points:

- 📞 **Phone numbers shown are placeholders** - Real telephony integration requires carrier partnerships
- 🔒 **Government compliance required** - Production deployment needs regulatory approval for IVR services
- 🎤 **Web demo is fully functional** - Test the AI tutor capabilities using your browser's microphone
- 🚀 **Enterprise-ready architecture** - The backend is designed for easy telephony provider integration

---

## 🚀 Features

### Landing Page
- ✨ Stunning animations with Framer Motion
- 📱 Fully responsive design (mobile-first)
- 🌙 Modern dark theme with gradient accents
- ⚡ Optimized performance with Vite

### Voice Demo
- 🎤 Real-time speech-to-text (Deepgram)
- 🤖 AI-powered responses (Groq LLM - Llama 3.3 70B)
- 🔊 Natural text-to-speech (ElevenLabs + Browser fallback)
- 📚 7 education levels supported
- 💬 Conversation history with replay

### Sections
- **Hero** - Animated landing with call-to-action
- **Features** - Key platform capabilities
- **How It Works** - Step-by-step user journey
- **Tech Stack** - Technologies powering GuruCall
- **Categories** - 7 academic domains explained
- **Voice Demo** - Interactive AI tutor simulation
- **CTA** - Final call-to-action with demo info

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework with latest features |
| **TypeScript** | Type-safe development |
| **Vite 7** | Lightning-fast build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Beautiful icons |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see `/backend`)

### Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file if you need to customize:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Backend Connection

The frontend expects the backend to be running on `http://localhost:3000`. The Voice Demo section includes a real-time connection status indicator.

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Hero.tsx          # Landing section
│   │   ├── Features.tsx      # Features grid
│   │   ├── HowItWorks.tsx    # Process steps
│   │   ├── TechStack.tsx     # Technology showcase
│   │   ├── Categories.tsx    # Education levels
│   │   ├── VoiceDemo.tsx     # Interactive demo
│   │   ├── CTA.tsx           # Call-to-action
│   │   ├── Navbar.tsx        # Navigation
│   │   ├── Footer.tsx        # Footer section
│   │   └── index.ts          # Barrel export
│   ├── App.tsx          # Main application
│   ├── App.css          # Custom styles
│   ├── index.css        # Tailwind imports
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

---

## 🎨 Design System

### Colors

| Color | Usage |
|-------|-------|
| `primary-500` | Primary brand color (sky blue) |
| `accent-500` | Accent highlights (fuchsia) |
| `dark-900` | Background |
| `dark-800` | Card backgrounds |
| `dark-400` | Secondary text |

### Typography

- **Display Font**: Inter (headings)
- **Body Font**: Inter (content)
- **Mono Font**: JetBrains Mono (code)

---

## 🧪 Voice Demo Usage

1. **Select Education Level** - Choose from Class 1-5 to Professional
2. **Click Microphone** - Start recording your question
3. **Speak Clearly** - Ask any academic question
4. **Click Again** - Stop recording
5. **Listen** - AI processes and responds with voice
6. **Replay** - Click on any response to hear it again

### Supported Topics
- Mathematics, Science, Physics
- Chemistry, Biology
- History, Geography
- Literature, Languages
- Engineering concepts
- Medical terminology
- Commerce & Economics
- Arts & Humanities

---

## 🔒 Browser Permissions

The Voice Demo requires:
- 🎤 Microphone access for voice input
- 🔊 Audio playback for TTS responses

---

## 📝 License

This project is part of the GuruCall educational platform prototype.

---

## 🤝 Contributing

This is a demonstration project. For enterprise inquiries about production deployment with real telephony integration, please contact the team.

---

<div align="center">
  <p>Made with ❤️ for accessible education</p>
  <p><strong>GuruCall</strong> - Education as Easy as Making a Phone Call</p>
</div>
