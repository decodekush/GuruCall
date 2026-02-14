import mongoose, { Schema, Document, Types } from 'mongoose';
import type { IConversation, EducationLevel } from '../types/index.js';

export interface IConversationDocument extends Omit<IConversation, 'userId'>, Document {
  userId: Types.ObjectId;
}

const conversationSchema = new Schema<IConversationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    educationLevel: {
      type: String,
      enum: ['1', '2', '3', '4', '5', '6', '7'],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      default: null,
    },
    responseTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user history queries
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ phoneNumber: 1, createdAt: -1 });

// Static method to get recent conversations for context
conversationSchema.statics.getRecentByUser = async function(
  userId: Types.ObjectId,
  limit: number = 5
) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('question answer educationLevel createdAt')
    .lean();
};

// Static method to get conversation stats
conversationSchema.statics.getUserStats = async function(userId: Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        avgResponseTime: { $avg: '$responseTime' },
        mostUsedLevel: { $first: '$educationLevel' },
      },
    },
  ]);
  return stats[0] || { totalQuestions: 0, avgResponseTime: 0 };
};

export const Conversation = mongoose.model<IConversationDocument>(
  'Conversation',
  conversationSchema
);
