import { Router, Request, Response } from 'express';
import { groqService, userService, ttsService, sttService } from '../services/index.js';
import logger from '../utils/logger.js';
import type { EducationLevel, ApiResponse } from '../types/index.js';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'GuruCall API is running',
    timestamp: new Date().toISOString(),
  } as ApiResponse);
});

/**
 * Get all education categories
 */
router.get('/categories', (req: Request, res: Response) => {
  const categories = groqService.getAllCategories();
  res.json({
    success: true,
    data: categories,
  } as ApiResponse);
});

/**
 * Test AI response (for development)
 */
router.post('/test-ai', async (req: Request, res: Response) => {
  try {
    const { question, level = '2' } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      } as ApiResponse);
    }

    const startTime = Date.now();
    const response = await groqService.generateResponse(
      question,
      level as EducationLevel
    );
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        question,
        level,
        answer: response.text,
        tokensUsed: response.tokensUsed,
        responseTime: `${responseTime}ms`,
      },
    } as ApiResponse);
  } catch (error) {
    logger.error('Test AI error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response',
    } as ApiResponse);
  }
});

/**
 * Test TTS (for development)
 */
router.post('/test-tts', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required',
      } as ApiResponse);
    }

    const result = await ttsService.synthesize(text);
    
    res.json({
      success: true,
      data: {
        audioUrl: result.audioUrl,
        audioPath: result.audioPath,
      },
    } as ApiResponse);
  } catch (error) {
    logger.error('Test TTS error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to synthesize speech',
    } as ApiResponse);
  }
});

/**
 * Get user conversation history
 */
router.get('/history/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const phoneNumber = req.params.phoneNumber as string;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const conversations = await userService.getRecentConversations(phoneNumber, limit);
    
    res.json({
      success: true,
      data: conversations,
    } as ApiResponse);
  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history',
    } as ApiResponse);
  }
});

/**
 * Cleanup old audio files
 */
router.post('/cleanup', async (req: Request, res: Response) => {
  try {
    const maxAgeHours = parseInt(req.body.maxAgeHours) || 24;
    const deletedCount = await ttsService.cleanupOldFiles(maxAgeHours);
    
    res.json({
      success: true,
      data: { deletedFiles: deletedCount },
    } as ApiResponse);
  } catch (error) {
    logger.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      error: 'Cleanup failed',
    } as ApiResponse);
  }
});

/**
 * STT - Transcribe audio (for SIP handler)
 */
router.post('/stt/transcribe', async (req: Request, res: Response) => {
  try {
    const { audio, mimeType = 'audio/wav' } = req.body;
    
    if (!audio) {
      return res.status(400).json({
        success: false,
        error: 'Audio data is required (base64 encoded)',
      } as ApiResponse);
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64');
    
    // Transcribe using STT service
    const transcription = await sttService.transcribeFromBuffer(audioBuffer, mimeType);
    
    // Prominent logging for STT result
    logger.info(`\n🎤 ══════════════════════════════════════════`);
    logger.info(`🎤 STT TRANSCRIPTION: "${transcription}"`);
    logger.info(`🎤 ══════════════════════════════════════════\n`);
    
    res.json({
      success: true,
      transcription,
    });
  } catch (error) {
    logger.error('STT transcription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio',
    } as ApiResponse);
  }
});

/**
 * Groq - Generate AI response (for voice demo)
 */
router.post('/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { question, educationLevel = 'high_school', context = [] } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      } as ApiResponse);
    }

    // Map education level to category
    const levelMap: Record<string, EducationLevel> = {
      'elementary': '1',
      'middle_school': '2',
      'high_school': '2',
      'undergraduate': '3',
      'graduate': '4',
      'professional': '5'
    };
    
    const level = levelMap[educationLevel] || '2';
    
    // Generate response with context
    const response = await groqService.generateResponseWithContext(
      question,
      level,
      context
    );
    
    // Prominent logging for Groq AI response
    logger.info(`\n🤖 ══════════════════════════════════════════`);
    logger.info(`🤖 GROQ AI RESPONSE: "${response.text}"`);
    logger.info(`🤖 Tokens used: ${response.tokensUsed}`);
    logger.info(`🤖 ══════════════════════════════════════════\n`);
    
    res.json({
      success: true,
      response: response.text,
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    logger.error('Groq generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
    } as ApiResponse);
  }
});

/**
 * TTS - Synthesize speech (using ElevenLabs SDK)
 */
router.post('/tts/synthesize', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required',
      } as ApiResponse);
    }

    // Use synthesizeToBuffer for direct response without saving to file
    const audioBuffer = await ttsService.synthesizeToBuffer(text);
    
    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Length', audioBuffer.length.toString());
    res.send(audioBuffer);
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to synthesize speech';
    logger.error('TTS synthesis error:', errorMessage);
    
    // Return specific status codes based on error type
    let statusCode = 500;
    if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      statusCode = 401;
    } else if (errorMessage.includes('rate limit')) {
      statusCode = 429;
    } else if (errorMessage.includes('voice ID')) {
      statusCode = 422;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      hint: 'The frontend will automatically use browser TTS as fallback.',
    } as ApiResponse);
  }
});

/**
 * Save conversation (for SIP handler)
 */
router.post('/conversation/save', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, messages, duration } = req.body;
    
    if (!phoneNumber || !messages) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and messages are required',
      } as ApiResponse);
    }

    // Save each message as a conversation entry
    // Get or create user first
    let user = await userService.findOrCreateUser(phoneNumber);
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role === 'user') {
        const answerMsg = messages[i + 1];
        if (answerMsg && answerMsg.role === 'assistant') {
          await userService.saveConversation(
            user._id,
            phoneNumber,
            '2', // Default education level
            msg.content,
            answerMsg.content,
            0 // Unknown response time
          );
        }
      }
    }
    
    logger.info(`Saved conversation for ${phoneNumber}, duration: ${duration}ms`);
    
    res.json({
      success: true,
      message: 'Conversation saved',
    });
  } catch (error) {
    logger.error('Save conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save conversation',
    } as ApiResponse);
  }
});

export default router;
