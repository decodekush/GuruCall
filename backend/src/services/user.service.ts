import { User, Conversation, IUserDocument, IConversationDocument } from '../models/index.js';
import logger from '../utils/logger.js';
import type { EducationLevel, ConversationContext } from '../types/index.js';
import { Types } from 'mongoose';

class UserService {
  /**
   * Find or create user by phone number
   */
  async findOrCreateUser(phoneNumber: string): Promise<IUserDocument> {
    try {
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
      
      let user = await User.findOne({ phoneNumber: cleanPhone });
      
      if (!user) {
        user = await User.create({
          phoneNumber: cleanPhone,
          totalCalls: 0,
        });
        logger.info(`New user created: ${cleanPhone}`);
      }

      return user;
    } catch (error) {
      logger.error('Error finding/creating user:', error);
      throw new Error('Failed to process user');
    }
  }

  /**
   * Update user's preferred education level
   */
  async updatePreferredLevel(userId: Types.ObjectId, level: EducationLevel): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { preferredLevel: level });
    } catch (error) {
      logger.error('Error updating user level:', error);
    }
  }

  /**
   * Save conversation to history
   */
  async saveConversation(
    userId: Types.ObjectId,
    phoneNumber: string,
    level: EducationLevel,
    question: string,
    answer: string,
    responseTime: number,
    audioUrl?: string
  ): Promise<IConversationDocument> {
    try {
      const conversation = await Conversation.create({
        userId,
        phoneNumber,
        educationLevel: level,
        question,
        answer,
        responseTime,
        audioUrl,
      });

      // Increment user's call count
      await User.findByIdAndUpdate(userId, { $inc: { totalCalls: 1 } });

      logger.info(`Conversation saved for user ${phoneNumber}`);
      return conversation;
    } catch (error) {
      logger.error('Error saving conversation:', error);
      throw new Error('Failed to save conversation');
    }
  }

  /**
   * Get conversation context for AI (recent history)
   */
  async getConversationContext(
    userId: Types.ObjectId,
    limit: number = 5
  ): Promise<ConversationContext> {
    try {
      const recentConversations = await Conversation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('question answer educationLevel')
        .lean();

      const user = await User.findById(userId).lean();

      // Reverse to get chronological order
      const sorted = recentConversations.reverse();

      return {
        recentQuestions: sorted.map(c => c.question),
        recentAnswers: sorted.map(c => c.answer),
        userPreferences: user ? {
          level: (user.preferredLevel || '2') as EducationLevel,
          totalInteractions: user.totalCalls,
        } : undefined,
      };
    } catch (error) {
      logger.error('Error getting conversation context:', error);
      return {
        recentQuestions: [],
        recentAnswers: [],
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: Types.ObjectId) {
    try {
      const user = await User.findById(userId).lean();
      const conversationCount = await Conversation.countDocuments({ userId });
      
      const levelStats = await Conversation.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$educationLevel',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      const avgResponseTime = await Conversation.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            avgTime: { $avg: '$responseTime' },
          },
        },
      ]);

      return {
        user,
        totalConversations: conversationCount,
        levelUsage: levelStats,
        avgResponseTime: avgResponseTime[0]?.avgTime || 0,
      };
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw new Error('Failed to get user statistics');
    }
  }

  /**
   * Get recent conversations for a user
   */
  async getRecentConversations(
    phoneNumber: string,
    limit: number = 10
  ) {
    try {
      const conversations = await Conversation.find({ phoneNumber })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      return conversations;
    } catch (error) {
      logger.error('Error getting recent conversations:', error);
      return [];
    }
  }
}

// Export singleton instance
export const userService = new UserService();
