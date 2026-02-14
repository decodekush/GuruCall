import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  groq: {
    apiKey: string;
    model: string;
  };
  deepgram: {
    apiKey: string;
    ttsModel: string;
  };
  camb: {
    apiKey: string;
    voiceId: number;
    speechModel: string;
  };
  elevenlabs: {
    apiKey: string;
    voiceId: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  mongodb: {
    uri: string;
  };
  baseUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: 'llama-3.3-70b-versatile', // Current stable Groq model
  },
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY || '',
    ttsModel: process.env.DEEPGRAM_TTS_MODEL || 'aura-2-thalia-en',
  },
  camb: {
    apiKey: process.env.CAMB_API_KEY || '',
    voiceId: parseInt(process.env.CAMB_VOICE_ID || '147320', 10),
    speechModel: process.env.CAMB_SPEECH_MODEL || 'mars-flash',
  },
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gurucall',
  },
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
};

// Validate required config
const requiredConfigs = [
  { key: 'GROQ_API_KEY', value: config.groq.apiKey },
  { key: 'DEEPGRAM_API_KEY', value: config.deepgram.apiKey },
  { key: 'CAMB_API_KEY', value: config.camb.apiKey },
];

export const validateConfig = (): void => {
  const missing = requiredConfigs.filter(c => !c.value);
  if (missing.length > 0) {
    console.warn(`⚠️ Missing config keys: ${missing.map(m => m.key).join(', ')}`);
  }
};

export default config;
