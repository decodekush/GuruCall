# 📞 GuruCall – Voice AI Tutor

GuruCall is a voice-first AI tutor that allows users to call a number, ask educational questions via voice, and receive AI-generated answers — all within the same call. Designed to democratize access to education, GuruCall makes learning as easy as making a phone call — even without internet or a smartphone.

---

## 🌟 Vision

To build an inclusive and accessible educational platform powered by voice and AI that:

- 📚 Allows users of all literacy levels to ask academic questions in natural language
- 🎯 Delivers personalized, curriculum-aligned answers based on the learner’s academic level
- 📞 Works on any basic mobile or landline — no app, no login, no internet required
- 🌍 Brings AI-powered education to rural and underconnected regions

---

## 🧠 How It Works

1. 👤 User calls the Twilio number.
2. 📊 They select their education level using keypad input (1 to 7).
3. 🎤 They speak their academic question after the beep.
4. 🧠 On the backend:
   - 📜 Recording is transcribed using Deepgram (Speech-to-Text).
   - 🤖 The text is processed with GPT-4o via OpenAI to generate an explanation.
   - 🔊 The response is converted to audio using ElevenLabs (Text-to-Speech).
5. 🔁 The synthesized answer is played back to the user in the same call.
6. ✅ User receives their answer and hangs up. All voice, no screen!

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

| Technology      | Role                                            |
|-----------------|-------------------------------------------------|
| Twilio Studio   | IVR menu, call flow, input gathering            |
| Node.js + Express | REST API server, logic orchestration         |
| Deepgram API    | Transcribes audio to text (STT)                 |
| OpenAI GPT-4o   | Generates contextual academic answers (LLM)     |
| ElevenLabs API  | Converts AI text response to natural voice (TTS)|
| Render          | Cloud deployment for backend                    |
| Ngrok (optional)| Expose localhost during development             |

---

## 🧪 Development Setup

1. Clone this repo:

```bash
git clone https://github.com/your-username/gurucall-backend.git
cd gurucall-backend
```
2.Install dependencies:
```bash
npm install
```
3. Create a .env file:
```bash
PORT=3000
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENAI_API_KEY=your_openai_api_key

```
4. Start the development server:
   ```bash
   npm run dev
   ```
