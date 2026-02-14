/**
 * Groq LLM Service
 * Uses Groq's fast inference API for generating educational responses
 */

import Groq from 'groq-sdk';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import type { 
  EducationLevel, 
  ConversationContext,
  EducationCategory 
} from '../types/index.js';

// Response type
export interface LLMResponse {
  text: string;
  tokensUsed: number;
}

// Education level configurations with detailed prompts for better accuracy
const educationCategories: Record<EducationLevel, EducationCategory> = {
  '1': {
    id: '1',
    name: 'Class 1-5',
    description: 'Primary School',
    tone: 'Playful & Simple',
    prompt: `You are a friendly teacher for young children (ages 6-10, Class 1-5).
- Use very simple words and short sentences
- Include fun examples, stories, or comparisons to toys, animals, or games
- Be encouraging and enthusiastic
- Avoid technical jargon completely
- Use analogies children can relate to (like comparing the heart to a pump)`,
  },
  '2': {
    id: '2',
    name: 'Class 6-10',
    description: 'Middle School',
    tone: 'Relatable & Clear',
    prompt: `You are a helpful teacher for middle school students (ages 11-15, Class 6-10).
- Use school-level language with clear explanations
- Include relatable real-world examples
- Build on concepts they might know from school
- Break down complex topics into digestible parts
- Use analogies from daily life, sports, or technology they use`,
  },
  '3': {
    id: '3',
    name: 'Class 11-12',
    description: 'Higher Secondary',
    tone: 'Academic & Conceptual',
    prompt: `You are an expert teacher for senior secondary students (ages 16-18, Class 11-12).
- Use proper academic terminology with explanations
- Provide conceptual depth and theoretical foundations
- Connect topics to board exam patterns when relevant
- Include formulas, principles, and their applications
- Prepare them for competitive exams and higher education`,
  },
  '4': {
    id: '4',
    name: 'Engineering',
    description: 'Technical Education',
    tone: 'Technical & Precise',
    prompt: `You are a technical expert for engineering students.
- Use precise technical terminology
- Include mathematical formulations where applicable
- Explain practical applications and industry relevance
- Reference standard engineering principles and practices
- Cover both theoretical foundations and practical implementations`,
  },
  '5': {
    id: '5',
    name: 'Medical',
    description: 'Medical Education',
    tone: 'Clinical & Detailed',
    prompt: `You are a medical educator for medical students.
- Use proper medical terminology (with explanations)
- Emphasize clinical relevance and patient care aspects
- Include anatomical, physiological, and pathological details
- Reference standard medical practices and guidelines
- Connect theory to clinical scenarios and case studies`,
  },
  '6': {
    id: '6',
    name: 'Commerce',
    description: 'Business Education',
    tone: 'Business-Oriented',
    prompt: `You are a commerce and business educator.
- Focus on business, finance, economics, and accounting concepts
- Use real-world business examples and case studies
- Include relevant formulas, ratios, and calculations
- Connect theory to practical business scenarios
- Reference current market trends when applicable`,
  },
  '7': {
    id: '7',
    name: 'Arts',
    description: 'Humanities Education',
    tone: 'Creative & Contextual',
    prompt: `You are a humanities and arts educator.
- Provide historical, social, and cultural context
- Include multiple perspectives and interpretations
- Use examples from literature, history, and social sciences
- Encourage critical thinking and analysis
- Connect topics to broader social and cultural themes`,
  },
};

class GroqService {
  private groq: Groq;
  private model: string;
  private maxRetries = 3;
  private retryDelayMs = 2000;

  constructor() {
    this.groq = new Groq({
      apiKey: config.groq.apiKey,
    });
    this.model = config.groq.model;
  }

  /**
   * Sleep helper for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Build system prompt with education level and context
   */
  private buildSystemPrompt(level: EducationLevel, context?: ConversationContext): string {
    const category = educationCategories[level];
    
    let systemPrompt = `You are GuruCall, an AI-powered voice tutor that helps students learn through phone calls.

## Your Role:
${category.prompt}

## Response Guidelines:
1. Keep responses concise but complete (ideal for voice playback)
2. Structure your answer clearly with main points
3. Use natural, conversational language suitable for audio
4. Avoid using special characters, markdown, or formatting
5. Aim for responses under 200 words for quick delivery
6. Be accurate and educational while being engaging

## Current Education Level: ${category.name} (${category.description})
## Tone: ${category.tone}`;

    // Add conversation context for personalization
    if (context && context.recentQuestions.length > 0) {
      systemPrompt += `\n\n## Recent Conversation History (for context):`;
      for (let i = 0; i < Math.min(context.recentQuestions.length, 3); i++) {
        systemPrompt += `\nPrevious Q${i + 1}: ${context.recentQuestions[i]}`;
        if (context.recentAnswers[i]) {
          systemPrompt += `\nPrevious A${i + 1}: ${context.recentAnswers[i].substring(0, 100)}...`;
        }
      }
      systemPrompt += `\n\nUse this history to provide continuity and avoid repetition.`;
    }

    return systemPrompt;
  }

  /**
   * Generate a response using Groq with context awareness
   */
  async generateResponse(
    question: string,
    level: EducationLevel,
    context?: ConversationContext
  ): Promise<LLMResponse> {
    const startTime = Date.now();
    
    const systemPrompt = this.buildSystemPrompt(level, context);
    
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Student's Question: ${question}`,
      },
    ];

    // Retry loop for rate limit handling
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const completion = await this.groq.chat.completions.create({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.8,
        });

        const text = completion.choices[0]?.message?.content || '';
        
        // Clean response for voice output
        const cleanedText = this.cleanForVoice(text);
        
        const endTime = Date.now();
        logger.info(`Groq response generated in ${endTime - startTime}ms`);

        return {
          text: cleanedText,
          tokensUsed: completion.usage?.total_tokens || 0,
        };
      } catch (error: any) {
        const isRateLimit = error?.status === 429 || error?.message?.includes('rate');
        const errorMessage = error?.error?.message || error?.message || String(error);
        
        logger.error(`Groq API Error (attempt ${attempt}/${this.maxRetries}):`, errorMessage);
        
        if (isRateLimit && attempt < this.maxRetries) {
          logger.warn(`Rate limit hit, retrying in ${this.retryDelayMs}ms (attempt ${attempt}/${this.maxRetries})`);
          await this.sleep(this.retryDelayMs * attempt);
          continue;
        }
        
        throw new Error(`Failed to generate AI response: ${errorMessage}`);
      }
    }
    
    throw new Error('Failed to generate AI response after retries');
  }

  /**
   * Clean text for voice output (remove markdown, special chars, etc.)
   */
  private cleanForVoice(text: string): string {
    return text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/`{1,3}/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
      .replace(/[•●○■□]/g, '-') // Replace bullet points
      .trim();
  }

  /**
   * Generate response with external conversation context (for voice demo)
   */
  async generateResponseWithContext(
    question: string,
    level: EducationLevel,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<LLMResponse> {
    const startTime = Date.now();
    
    // Convert external context to internal format
    const context: ConversationContext = {
      recentQuestions: conversationHistory
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .slice(-5),
      recentAnswers: conversationHistory
        .filter(m => m.role === 'assistant')
        .map(m => m.content)
        .slice(-5),
      userPreferences: {
        level,
        totalInteractions: conversationHistory.length,
      },
    };
    
    const systemPrompt = this.buildSystemPrompt(level, context);
    
    // Build messages with conversation history
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add recent conversation turns for better context
    for (const msg of conversationHistory.slice(-6)) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    // Add current question
    messages.push({
      role: 'user',
      content: `Student's Question: ${question}`,
    });

    // Retry loop for rate limit handling
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const completion = await this.groq.chat.completions.create({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.8,
        });

        const text = completion.choices[0]?.message?.content || '';
        
        // Clean response for voice output
        const cleanedText = this.cleanForVoice(text);
        
        const endTime = Date.now();
        logger.info(`Groq context response generated in ${endTime - startTime}ms`);

        return {
          text: cleanedText,
          tokensUsed: completion.usage?.total_tokens || 0,
        };
      } catch (error: any) {
        const isRateLimit = error?.status === 429 || error?.message?.includes('rate');
        
        if (isRateLimit && attempt < this.maxRetries) {
          logger.warn(`Rate limit hit, retrying in ${this.retryDelayMs}ms (attempt ${attempt}/${this.maxRetries})`);
          await this.sleep(this.retryDelayMs * attempt);
          continue;
        }
        
        logger.error('Groq API Error with context:', error?.message || error);
        
        // Fallback to simple response without context
        try {
          logger.info('Attempting fallback without conversation context...');
          return await this.generateResponse(question, level);
        } catch (fallbackError) {
          logger.error('Fallback also failed:', fallbackError);
          throw new Error('Failed to generate AI response with context');
        }
      }
    }
    
    throw new Error('Failed to generate AI response after retries');
  }

  /**
   * Get education category info
   */
  getCategory(level: EducationLevel): EducationCategory {
    return educationCategories[level];
  }

  /**
   * Get all education categories
   */
  getAllCategories(): EducationCategory[] {
    return Object.values(educationCategories);
  }
}

// Export singleton instance
export const groqService = new GroqService();
export { educationCategories };
