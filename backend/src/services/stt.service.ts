import { createClient, DeepgramClient } from '@deepgram/sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import type { TranscriptionResult } from '../types/index.js';

class SpeechToTextService {
  private deepgram: DeepgramClient;

  constructor() {
    this.deepgram = createClient(config.deepgram.apiKey);
  }

  /**
   * Transcribe audio from URL (Twilio recordings)
   */
  async transcribeFromUrl(audioUrl: string): Promise<TranscriptionResult> {
    try {
      const startTime = Date.now();
      logger.info(`Starting transcription from URL: ${audioUrl}`);

      const { result, error } = await this.deepgram.listen.prerecorded.transcribeUrl(
        { url: audioUrl },
        {
          model: 'nova-2', // Most accurate model
          language: 'en-IN', // Indian English for better accent recognition
          smart_format: true,
          punctuate: true,
          diarize: false,
          filler_words: false,
          profanity_filter: false,
        }
      );

      if (error) {
        logger.error('Deepgram error:', error);
        throw new Error(`Transcription failed: ${error.message}`);
      }

      const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
      const language = result?.results?.channels?.[0]?.detected_language || 'en';

      const endTime = Date.now();
      logger.info(`Transcription completed in ${endTime - startTime}ms with ${(confidence * 100).toFixed(1)}% confidence`);

      return {
        transcript,
        confidence,
        language,
      };
    } catch (error) {
      logger.error('Speech-to-Text Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Transcribe audio from file path
   */
  async transcribeFromFile(filePath: string): Promise<TranscriptionResult> {
    try {
      const startTime = Date.now();
      logger.info(`Starting transcription from file: ${filePath}`);

      const audioBuffer = fs.readFileSync(filePath);

      const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: 'nova-2',
          language: 'en-IN',
          smart_format: true,
          punctuate: true,
          mimetype: this.getMimeType(filePath),
        }
      );

      if (error) {
        logger.error('Deepgram error:', error);
        throw new Error(`Transcription failed: ${error.message}`);
      }

      const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
      const language = result?.results?.channels?.[0]?.detected_language || 'en';

      const endTime = Date.now();
      logger.info(`File transcription completed in ${endTime - startTime}ms`);

      return {
        transcript,
        confidence,
        language,
      };
    } catch (error) {
      logger.error('Speech-to-Text File Error:', error);
      throw new Error('Failed to transcribe audio file');
    }
  }

  /**
   * Download audio from URL and save locally
   */
  async downloadAudio(url: string, outputPath: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 30000,
      });

      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          logger.info(`Audio downloaded to: ${outputPath}`);
          resolve(outputPath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      logger.error('Audio download error:', error);
      throw new Error('Failed to download audio');
    }
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.mp3': 'audio/mp3',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/m4a',
      '.webm': 'audio/webm',
      '.flac': 'audio/flac',
    };
    return mimeTypes[ext] || 'audio/mp3';
  }

  /**
   * Transcribe audio from buffer (for SIP handler)
   */
  async transcribeFromBuffer(audioBuffer: Buffer, mimeType: string = 'audio/wav'): Promise<string> {
    try {
      const startTime = Date.now();
      logger.info(`Starting transcription from buffer, size: ${audioBuffer.length} bytes`);

      const { result, error } = await this.deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: 'nova-2',
          language: 'en-IN',
          smart_format: true,
          punctuate: true,
          mimetype: mimeType,
        }
      );

      if (error) {
        logger.error('Deepgram error:', error);
        throw new Error(`Transcription failed: ${error.message}`);
      }

      const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;

      const endTime = Date.now();
      logger.info(`Buffer transcription completed in ${endTime - startTime}ms with ${(confidence * 100).toFixed(1)}% confidence`);

      return transcript;
    } catch (error) {
      logger.error('Speech-to-Text Buffer Error:', error);
      throw new Error('Failed to transcribe audio buffer');
    }
  }
}

// Export singleton instance
export const sttService = new SpeechToTextService();
