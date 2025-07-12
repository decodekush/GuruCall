import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@deepgram/sdk';
import twilio from 'twilio';

const { twiml: twimlLib } = twilio;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/tts', express.static(path.join(__dirname, 'tts'))); // Serve generated TTS files

const educationPrompts = {
  '1': 'Explain like I am in Class 1 to 5. Use very simple language and fun examples.',
  '2': 'Explain like I am in Class 6 to 10. Use school-level language, with analogies.',
  '3': 'Explain like I am in Class 11 or 12. Use subject-specific depth and concepts.',
  '4': 'Explain with depth and precision suitable for an Engineering student. Use technical terminology.',
  '5': 'Explain tailored to a Medical student’s syllabus. Emphasize biology and real-world clinical relevance.',
  '6': 'Explain with relevance to Commerce students. Focus on business, finance, and economics perspective.',
  '7': 'Explain for Arts students. Use historical, social, or creative context depending on the question.'
};

const synthesizeSpeech = async (text, outPath) => {
  try {
    const { data: audioStream } = await deepgram.speak.request(
      {
        text,
        model: 'aura-asteria-en',
        encoding: 'mp3',
      },
      { responseType: 'stream' }
    );

    const writer = fs.createWriteStream(outPath);
    audioStream.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ TTS saved at ${outPath}`);
        resolve(true);
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error('❌ Deepgram TTS Error:', err.response?.data || err.message);
    return false;
  }
};

app.post('/twilio-webhook', async (req, res) => {
  const { RecordingUrl, From, Digits } = req.body;
  const categoryId = Digits || '1';
  console.log("📞 From:", From);
  console.log("🎙️ Recording URL:", RecordingUrl);
  console.log("📚 Category:", categoryId);

  const recordingDir = path.join(__dirname, 'recordings');
  const ttsDir = path.join(__dirname, 'tts');
  fs.mkdirSync(recordingDir, { recursive: true });
  fs.mkdirSync(ttsDir, { recursive: true });

  const audioFilePath = path.join(recordingDir, `${From}_${Date.now()}.mp3`);
  const ttsFileName = `${From}_reply.mp3`;
  const ttsFilePath = path.join(ttsDir, ttsFileName);

  try {
    const audioStream = await axios.get(RecordingUrl, { responseType: 'stream' });
    const audioWriter = fs.createWriteStream(audioFilePath);
    audioStream.data.pipe(audioWriter);

    audioWriter.on('finish', async () => {
      console.log(`✅ Saved caller audio to ${audioFilePath}`);

      const { result } = await deepgram.listen.prerecorded.transcribeUrl(
        { url: RecordingUrl },
        {
          model: 'nova-3',
          language: 'en-IN',
          smart_format: true,
          punctuate: true
        }
      );

      const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      console.log("📝 Transcript:", transcript);

      if (!transcript) {
        return res.type('text/xml').send(`<Response><Say>Sorry, I couldn't understand that.</Say></Response>`);
      }

      // Replace this mock response with GPT when ready
      const prompt = educationPrompts[categoryId];
      // const fullPrompt = `${prompt}\n\nQuestion: ${transcript}`;
      // const gptResponse = await openai.chat.completions.create({...});
      // const reply = gptResponse.choices[0].message.content.trim();
      const reply = "This is a mock explanation for testing purposes.";

      console.log("🤖 AI Reply:", reply);

      const success = await synthesizeSpeech(reply, ttsFilePath);

      if (!success) {
        return res.type('text/xml').send(`<Response><Say>Sorry, the system encountered an error.</Say></Response>`);
      }

      const absoluteTTSUrl = `${req.protocol}://${req.get('host')}/tts/${ttsFileName}`;
      const twiml = new twimlLib.VoiceResponse();
      twiml.play(absoluteTTSUrl);
      return res.type('text/xml').send(twiml.toString());
    });

    audioWriter.on('error', err => {
      console.error('❌ File save error:', err);
      return res.type('text/xml').send(`<Response><Say>Sorry, failed to save your audio.</Say></Response>`);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).send('Internal error');
  }
});

app.get('/', (req, res) => {
  res.send('🌐 Voice AI Tutor is live.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
