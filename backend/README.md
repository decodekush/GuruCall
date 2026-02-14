# GuruCall Backend

TypeScript-based backend for the GuruCall voice AI tutor platform.

## Features

- 🤖 **Google Gemini AI** - Context-aware responses with conversation memory
- 🎤 **Deepgram STT** - Industry-leading speech-to-text transcription
- 🔊 **ElevenLabs TTS** - Natural, human-like voice synthesis
- 📞 **Twilio Integration** - Complete telephony and IVR system
- 🗄️ **MongoDB** - User profiles and conversation history
- 📝 **TypeScript** - Type-safe, modular architecture

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- API keys for Gemini, Deepgram, ElevenLabs, and Twilio

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Copy the example env file and fill in your API keys:

```bash
cp .env.example .env
```

Then edit `.env` with your credentials.

---

## 🔑 API Key Setup Guide

### 1. Google Gemini API Key (Pro Version)

Since you have Google One AI Premium (Gemini Pro):

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account (the one with Pro subscription)
3. Click **"Create API Key"**
4. Select your Google Cloud project (or create a new one)
5. Copy the generated API key
6. Add to `.env`: `GEMINI_API_KEY=your_key_here`

**Note:** With Pro, you get:
- Higher rate limits
- Access to Gemini 1.5 Pro model
- Longer context windows (up to 1M tokens)

### 2. Deepgram API Key

1. Go to [Deepgram Console](https://console.deepgram.com/)
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Click **"Create a New API Key"**
5. Give it a name (e.g., "GuruCall")
6. Select permissions: `member` is sufficient
7. Copy the API key
8. Add to `.env`: `DEEPGRAM_API_KEY=your_key_here`

**Free tier includes:** 200 hours/month of transcription

### 3. ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Click your profile icon → **"Profile + API Key"**
4. Under "API Key", click **"Reveal"** or generate a new one
5. Copy the API key
6. Add to `.env`: `ELEVENLABS_API_KEY=your_key_here`

**Optional:** Choose a different voice ID:
- Go to **"Voices"** section
- Click on a voice you like
- Copy the Voice ID from the URL or settings
- Add to `.env`: `ELEVENLABS_VOICE_ID=your_voice_id`

### 4. Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up or log in
3. On the dashboard, find:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)
4. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   ```
5. Get a phone number:
   - Go to **Phone Numbers → Buy a Number**
   - Choose a number with Voice capability
   - Add to `.env`: `TWILIO_PHONE_NUMBER=+1234567890`

### 5. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Use default connection
MONGODB_URI=mongodb://localhost:27017/gurucall
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add to `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gurucall`

---

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Health & Info
- `GET /` - API info
- `GET /api/health` - Health check
- `GET /api/categories` - List education levels

### Testing (Development)
- `POST /api/test-ai` - Test Gemini response
  ```json
  { "question": "What is photosynthesis?", "level": "2" }
  ```
- `POST /api/test-tts` - Test text-to-speech
  ```json
  { "text": "Hello, this is a test." }
  ```

### User Data
- `GET /api/history/:phoneNumber` - Get user conversation history

### Twilio Webhooks
- `POST /api/twilio/voice` - Initial call handler
- `POST /api/twilio/level-selected` - Education level selection
- `POST /api/twilio/record` - Record user question
- `POST /api/twilio/process` - Process and respond
- `POST /api/twilio/continue` - Continue or end call
- `POST /api/twilio/status` - Call status callback

## Twilio Configuration

In your Twilio Console, configure the webhook URL for your phone number:

1. Go to **Phone Numbers → Manage → Active Numbers**
2. Click on your number
3. Under "Voice Configuration":
   - **A call comes in:** Webhook
   - **URL:** `https://your-domain.com/api/twilio/voice`
   - **HTTP Method:** POST
4. **Status Callback URL:** `https://your-domain.com/api/twilio/status`

For local development, use [ngrok](https://ngrok.com/):
```bash
ngrok http 3000
```

## Architecture

```
src/
├── config/         # Configuration management
├── models/         # MongoDB schemas (User, Conversation)
├── routes/         # Express route handlers
├── services/       # Business logic
│   ├── gemini.service.ts   # AI response generation
│   ├── stt.service.ts      # Speech-to-text
│   ├── tts.service.ts      # Text-to-speech
│   └── user.service.ts     # User & conversation management
├── types/          # TypeScript type definitions
├── utils/          # Utilities (logger, database)
└── index.ts        # Application entry point
```

## Conversation Context System

The backend implements a conversation memory system for personalized responses:

1. **User Recognition** - Users are identified by phone number
2. **History Storage** - Each Q&A is stored in MongoDB
3. **Context Building** - Recent conversations are included in AI prompts
4. **Personalization** - AI considers user's education level and past questions

This enables responses like:
- "As we discussed earlier about photosynthesis..."
- Avoiding repetition of already-answered concepts
- Building on previous explanations

## License

ISC
