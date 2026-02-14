import { Router, Request, Response } from 'express';
import twilio from 'twilio';
import { groqService, sttService, ttsService, userService } from '../services/index.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';
import type { TwilioWebhookBody, EducationLevel } from '../types/index.js';

const router = Router();
const { twiml: TwiML } = twilio;

/**
 * Initial webhook - Greeting and education level selection
 * This is called when a user first calls the Twilio number
 */
router.post('/voice', (req: Request, res: Response) => {
  logger.info('Incoming call received');
  
  const response = new TwiML.VoiceResponse();
  
  // Welcome message
  response.say(
    { voice: 'Polly.Aditi', language: 'en-IN' },
    'Welcome to Guru Call, your AI-powered voice tutor!'
  );
  
  // Gather education level
  const gather = response.gather({
    numDigits: 1,
    action: '/api/twilio/level-selected',
    method: 'POST',
    timeout: 10,
  });
  
  gather.say(
    { voice: 'Polly.Aditi', language: 'en-IN' },
    `Please select your education level.
    Press 1 for Class 1 to 5.
    Press 2 for Class 6 to 10.
    Press 3 for Class 11 to 12.
    Press 4 for Engineering.
    Press 5 for Medical.
    Press 6 for Commerce.
    Press 7 for Arts.`
  );

  // If no input, default to level 2
  response.say(
    { voice: 'Polly.Aditi', language: 'en-IN' },
    'No selection made. Defaulting to Class 6 to 10 level.'
  );
  response.redirect({ method: 'POST' }, '/api/twilio/record?level=2');

  res.type('text/xml').send(response.toString());
});

/**
 * Handle education level selection
 */
router.post('/level-selected', (req: Request<{}, {}, TwilioWebhookBody>, res: Response) => {
  const { Digits, From } = req.body;
  const level = (Digits || '2') as EducationLevel;
  
  logger.info(`User ${From} selected level: ${level}`);
  
  const response = new TwiML.VoiceResponse();
  const category = groqService.getCategory(level);
  
  response.say(
    { voice: 'Polly.Aditi', language: 'en-IN' },
    `Great! You selected ${category.name}. Please ask your question after the beep.`
  );
  
  response.redirect({ method: 'POST' }, `/api/twilio/record?level=${level}`);
  
  res.type('text/xml').send(response.toString());
});

/**
 * Record user's question
 */
router.post('/record', (req: Request, res: Response) => {
  const level = req.query.level || '2';
  
  const response = new TwiML.VoiceResponse();
  
  response.record({
    action: `/api/twilio/process?level=${level}`,
    method: 'POST',
    maxLength: 60, // Max 60 seconds recording
    timeout: 3,
    playBeep: true,
    transcribe: false, // We'll use Deepgram instead
  });
  
  // If no recording, ask again
  response.say(
    { voice: 'Polly.Aditi', language: 'en-IN' },
    'I did not hear a question. Please try again.'
  );
  response.redirect({ method: 'POST' }, `/api/twilio/record?level=${level}`);
  
  res.type('text/xml').send(response.toString());
});

/**
 * Process recording - Main logic flow
 * 1. Transcribe audio (STT)
 * 2. Get/create user
 * 3. Fetch conversation context
 * 4. Generate AI response
 * 5. Convert to speech (TTS)
 * 6. Play response
 */
router.post('/process', async (req: Request<{}, {}, TwilioWebhookBody>, res: Response) => {
  const startTime = Date.now();
  const { RecordingUrl, From, CallSid } = req.body;
  const level = (req.query.level || '2') as EducationLevel;
  
  logger.info(`Processing recording for ${From}, Level: ${level}`);
  logger.info(`Recording URL: ${RecordingUrl}`);
  
  const response = new TwiML.VoiceResponse();
  
  try {
    if (!RecordingUrl) {
      response.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        'Sorry, I could not receive your recording. Please try again.'
      );
      response.redirect({ method: 'POST' }, `/api/twilio/record?level=${level}`);
      return res.type('text/xml').send(response.toString());
    }

    // Say "processing" while we work
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Processing your question. Please wait.'
    );

    // 1. Transcribe audio using Deepgram
    logger.info('Step 1: Transcribing audio...');
    const transcription = await sttService.transcribeFromUrl(RecordingUrl);
    
    if (!transcription.transcript || transcription.transcript.trim().length === 0) {
      response.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        'Sorry, I could not understand your question. Please speak clearly and try again.'
      );
      response.redirect({ method: 'POST' }, `/api/twilio/record?level=${level}`);
      return res.type('text/xml').send(response.toString());
    }
    
    logger.info(`Transcript: "${transcription.transcript}"`);

    // 2. Get or create user
    logger.info('Step 2: Getting user...');
    const user = await userService.findOrCreateUser(From);
    
    // 3. Get conversation context for better answers
    logger.info('Step 3: Fetching conversation context...');
    const context = await userService.getConversationContext(user._id);
    
    // 4. Generate AI response with context
    logger.info('Step 4: Generating AI response...');
    const aiResponse = await groqService.generateResponse(
      transcription.transcript,
      level,
      context
    );
    
    logger.info(`AI Response generated (${aiResponse.text.length} chars)`);

    // 5. Convert response to speech
    logger.info('Step 5: Synthesizing speech...');
    const audioFileName = `${CallSid}_response.mp3`;
    const ttsResult = await ttsService.synthesize(aiResponse.text, audioFileName);
    
    // 6. Save conversation to database
    const responseTime = Date.now() - startTime;
    logger.info('Step 6: Saving conversation...');
    await userService.saveConversation(
      user._id,
      From,
      level,
      transcription.transcript,
      aiResponse.text,
      responseTime,
      ttsResult.audioUrl
    );

    // Update user's preferred level
    await userService.updatePreferredLevel(user._id, level);

    // 7. Play the response
    logger.info(`Total processing time: ${responseTime}ms`);
    
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Here is your answer.'
    );
    response.play(ttsResult.audioUrl);
    
    // Ask if they want to continue
    const gather = response.gather({
      numDigits: 1,
      action: `/api/twilio/continue?level=${level}`,
      method: 'POST',
      timeout: 5,
    });
    
    gather.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Press 1 to ask another question, or press 2 to end the call.'
    );
    
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Thank you for using Guru Call. Goodbye!'
    );
    response.hangup();

    return res.type('text/xml').send(response.toString());
    
  } catch (error) {
    logger.error('Processing error:', error);
    
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Sorry, an error occurred while processing your question. Please try again later.'
    );
    response.hangup();
    
    return res.type('text/xml').send(response.toString());
  }
});

/**
 * Handle continue/end selection
 */
router.post('/continue', (req: Request<{}, {}, TwilioWebhookBody>, res: Response) => {
  const { Digits } = req.body;
  const level = req.query.level || '2';
  
  const response = new TwiML.VoiceResponse();
  
  if (Digits === '1') {
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Please ask your next question after the beep.'
    );
    response.redirect({ method: 'POST' }, `/api/twilio/record?level=${level}`);
  } else {
    response.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Thank you for using Guru Call. Have a great day learning! Goodbye!'
    );
    response.hangup();
  }
  
  res.type('text/xml').send(response.toString());
});

/**
 * Status callback for call events
 */
router.post('/status', (req: Request, res: Response) => {
  const { CallSid, CallStatus, From, CallDuration } = req.body;
  logger.info(`Call ${CallSid} from ${From}: ${CallStatus} (Duration: ${CallDuration}s)`);
  res.sendStatus(200);
});

export default router;
