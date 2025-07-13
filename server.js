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

app.use('/audio', express.static('public/audio'));
app.use('/tts', express.static(path.join(__dirname, 'tts')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  if (!text) {
    console.error("❌ ElevenLabs TTS Error: empty text.");
    return false;
  }

  try {
    const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Example: Rachel
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await axios.post(
      url,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'stream'
      }
    );

    console.log("🔁 ElevenLabs headers:", response.headers);

    const writer = fs.createWriteStream(outPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ TTS saved at ${outPath}`);
        resolve(true);
      });
      writer.on('error', err => {
        console.error('❌ Writer error:', err.message);
        reject(err);
      });
    });

  } catch (err) {
    console.error('❌ ElevenLabs TTS Error:', err.response?.data || err.message);
    return false;
  }
};


app.post('/twilio-webhook', async (req, res) => {
  const { RecordingUrl, From, Digits } = req.body;
  const categoryId = Digits || '1';
  const callerId = From.replace('+', '');

  console.log("📞 From:", From);
  console.log("🎙️ Recording URL:", RecordingUrl);
  console.log("📚 Selected Category:", categoryId);

  const recordingDir = path.join(__dirname, 'recordings');
  const ttsDir = path.join(__dirname, 'tts');
  fs.mkdirSync(recordingDir, { recursive: true });
  fs.mkdirSync(ttsDir, { recursive: true });

  const audioFilePath = path.join(recordingDir, `${callerId}_${Date.now()}.mp3`);
  const ttsFileName = `${callerId}_reply.mp3`;
  const ttsFilePath = path.join(ttsDir, ttsFileName);

  try {
    const audioStream = await axios.get(RecordingUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(audioFilePath);
    audioStream.data.pipe(writer);

    writer.on('finish', async () => {
      console.log(`✅ Saved audio to ${audioFilePath}`);

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
        const errorTwiml = new twimlLib.VoiceResponse();
        errorTwiml.say("Sorry, I couldn't understand your question. Please try again.");
        return res.type('text/xml').send(errorTwiml.toString());
      }

      const prompt = educationPrompts[categoryId];
      const reply = `This is a mock answer for: "${transcript}". ${prompt}`;

      // TODO: Replace with actual GPT response
      // const gptResponse = await openai.chat.completions.create(...);
      // const reply = gptResponse.choices[0].message.content.trim();

      const success = await synthesizeSpeech(reply, ttsFilePath);

      if (!success) {
        const failTwiml = new twimlLib.VoiceResponse();
        failTwiml.say("Sorry, we encountered an error while generating your answer.");
        return res.type('text/xml').send(failTwiml.toString());
      }

      const publicTTSUrl = `${req.protocol}://${req.get('host')}/tts/${ttsFileName}`;
      const responseTwiml = new twimlLib.VoiceResponse();
      responseTwiml.say("Here is your answer.");
      responseTwiml.play(publicTTSUrl);
      responseTwiml.say("Thank you for calling Guru Call. Goodbye!");

      return res.type('text/xml').send(responseTwiml.toString());
    });

    writer.on('error', err => {
      console.error('❌ Audio write error:', err);
      const errTwiml = new twimlLib.VoiceResponse();
      errTwiml.say("We could not process your audio. Please try again.");
      return res.type('text/xml').send(errTwiml.toString());
    });

  } catch (err) {
    console.error("❌ Server error:", err.message);
    const errTwiml = new twimlLib.VoiceResponse();
    errTwiml.say("Unexpected error occurred. Please try again later.");
    return res.type('text/xml').send(errTwiml.toString());
  }
});

app.get('/', (req, res) => {
  res.send('🌐 Voice AI Tutor is live and listening.');
});

app.listen(PORT, () => {
  console.log(`🚀 Server live at http://localhost:${PORT}`);
});
