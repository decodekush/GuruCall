import mongoose, { Schema, Document } from 'mongoose';
import type { IUser, EducationLevel } from '../types/index.js';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: null,
    },
    preferredLevel: {
      type: String,
      enum: ['1', '2', '3', '4', '5', '6', '7'],
      default: '2',
    },
    totalCalls: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster phone lookups
userSchema.index({ phoneNumber: 1 });

// Method to increment call count
userSchema.methods.incrementCalls = async function() {
  this.totalCalls += 1;
  await this.save();
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
