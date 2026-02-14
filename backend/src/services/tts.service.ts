import { createClient, DeepgramClient } from '@deepgram/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import type { TTSResult } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Deepgram TTS API endpoint
const DEEPGRAM_TTS_API = 'https://api.deepgram.com/v1/speak';

class TextToSpeechService {
  private client: DeepgramClient;
  private apiKey: string;
  private voiceModel: string;
  private outputDir: string;

  constructor() {
    this.apiKey = config.deepgram.apiKey;
    this.voiceModel = config.deepgram.ttsModel || 'aura-2-thalia-en';
    this.client = createClient(this.apiKey);
    this.outputDir = path.join(__dirname, '../../public/audio');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Convert text to speech using Deepgram TTS API
   */
  async synthesize(text: string, filename?: string): Promise<TTSResult> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for speech synthesis');
    }

    try {
      const startTime = Date.now();
      
      // Generate unique filename if not provided
      const audioFileName = filename || `${uuidv4()}.mp3`;
      const audioPath = path.join(this.outputDir, audioFileName);
      
      logger.info(`🔊 TTS Input: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);

      // Use Deepgram SDK for TTS
      const response = await this.client.speak.request(
        { text },
        {
          model: this.voiceModel,
        }
      );

      // Get the audio stream
      const stream = await response.getStream();
      if (!stream) {
        throw new Error('Failed to get audio stream from Deepgram');
      }

      // Convert stream to buffer
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const audioBuffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
      
      // Write audio buffer to file
      fs.writeFileSync(audioPath, audioBuffer);
      
      const endTime = Date.now();
      logger.info(`✅ TTS completed in ${endTime - startTime}ms, size: ${audioBuffer.length} bytes`);
      
      return {
        audioPath,
        audioUrl: `${config.baseUrl}/audio/${audioFileName}`,
      };
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Synthesize and return audio buffer directly (for streaming to client)
   */
  async synthesizeToBuffer(text: string): Promise<Buffer> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is required for speech synthesis');
    }

    // Check if API key is configured
    if (!this.apiKey || this.apiKey.length < 10) {
      throw new Error('Deepgram API key not configured. Please add a valid API key to .env');
    }

    try {
      const startTime = Date.now();
      logger.info(`🔊 TTS Input: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`);

      // Use Deepgram SDK for TTS
      const response = await this.client.speak.request(
        { text },
        {
          model: this.voiceModel,
        }
      );

      // Get the audio stream
      const stream = await response.getStream();
      if (!stream) {
        throw new Error('Failed to get audio stream from Deepgram');
      }

      // Convert stream to buffer
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const audioBuffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
      
      const endTime = Date.now();
      logger.info(`✅ TTS completed in ${endTime - startTime}ms, size: ${audioBuffer.length} bytes`);
      
      return audioBuffer;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle and log errors from Deepgram API
   */
  private handleError(error: any): void {
    const errorMessage = error.message || 'Unknown error';
    const statusCode = error.status || error.statusCode || 500;
    
    logger.error(`❌ Deepgram TTS Error [${statusCode}]:`, errorMessage);
    
    // Handle specific error cases
    if (statusCode === 401) {
      throw new Error('Deepgram authentication failed. Please check your API key in .env file.');
    }
    
    if (statusCode === 400) {
      throw new Error(`Invalid request: ${errorMessage}. Please check the text and model parameters.`);
    }
    
    if (statusCode === 413) {
      throw new Error('Text too long. Deepgram TTS has a 2000 character limit.');
    }
    
    if (statusCode === 429) {
      throw new Error('Deepgram rate limit exceeded. Please wait and try again.');
    }
    
    throw new Error(`Failed to synthesize speech: ${errorMessage}`);
  }

  /**
   * Get available voices (Deepgram has predefined models)
   */
  async getVoices(): Promise<string[]> {
    // Deepgram Aura-2 voices
    return [
      'aura-2-thalia-en',    // feminine, American, Clear/Confident/Energetic
      'aura-2-andromeda-en', // feminine, American, Casual/Expressive
      'aura-2-helena-en',    // feminine, American, Caring/Natural/Friendly
      'aura-2-apollo-en',    // masculine, American, Confident/Casual
      'aura-2-arcas-en',     // masculine, American, Natural/Smooth/Clear
      'aura-2-aries-en',     // masculine, American, Warm/Energetic/Caring
      'aura-2-orpheus-en',   // masculine, American, Professional/Clear/Trustworthy
      'aura-2-zeus-en',      // masculine, American, Deep/Trustworthy/Smooth
    ];
  }

  /**
   * Delete old audio files (cleanup)
   */
  async cleanupOldFiles(maxAgeHours: number = 24): Promise<number> {
    let deletedCount = 0;
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;

    try {
      const files = fs.readdirSync(this.outputDir);
      
      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      logger.info(`Cleaned up ${deletedCount} old audio files`);
      return deletedCount;
    } catch (error) {
      logger.error('Cleanup error:', error);
      return deletedCount;
    }
  }

  /**
   * Set voice model
   */
  setVoiceModel(model: string): void {
    this.voiceModel = model;
    logger.info(`Voice model changed to: ${model}`);
  }
}

// Export singleton instance
export const ttsService = new TextToSpeechService();
