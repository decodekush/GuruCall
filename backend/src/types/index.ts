// Education category types
export type EducationLevel = '1' | '2' | '3' | '4' | '5' | '6' | '7';

export interface EducationCategory {
  id: EducationLevel;
  name: string;
  description: string;
  prompt: string;
  tone: string;
}

// User types
export interface IUser {
  phoneNumber: string;
  name?: string;
  preferredLevel?: EducationLevel;
  totalCalls: number;
  createdAt: Date;
  updatedAt: Date;
}

// Conversation/Session types
export interface IConversation {
  userId: string;
  phoneNumber: string;
  educationLevel: EducationLevel;
  question: string;
  answer: string;
  audioUrl?: string;
  responseTime: number; // in milliseconds
  createdAt: Date;
}

// Gemini API types
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  text: string;
  tokensUsed: number;
}

// STT types
export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
}

// TTS types
export interface TTSResult {
  audioPath: string;
  audioUrl: string;
  duration?: number;
}

// Twilio webhook types
export interface TwilioWebhookBody {
  CallSid: string;
  From: string;
  To: string;
  RecordingUrl?: string;
  RecordingSid?: string;
  Digits?: string;
  SpeechResult?: string;
  CallStatus?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Context for AI
export interface ConversationContext {
  recentQuestions: string[];
  recentAnswers: string[];
  userPreferences?: {
    level: EducationLevel;
    totalInteractions: number;
  };
}
