import mongoose from 'mongoose';

// Call Status Enum
export enum CallStatus {
  PENDING = 'pending',
  DIALING = 'dialing',
  CONNECTED = 'connected',
  IN_PROGRESS = 'in_progress',
  SUMMARIZING = 'summarizing',
  NEEDS_FOLLOWUP = 'needs_followup',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Call Interface
export interface ICall extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  goal: string;
  expertId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: CallStatus;
  durationSeconds?: number;
  recordingUrl?: string;
  transcript?: string;
  summary?: string;
  failureReason?: string;
  contextLinks?: string[];
  contextText?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Call Schema
const callSchema = new mongoose.Schema(
  {
    goal: {
      type: String,
      required: [true, 'Goal is required'],
      trim: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CallStatus),
      default: CallStatus.PENDING,
    },
    durationSeconds: {
      type: Number,
    },
    recordingUrl: {
      type: String,
    },
    transcript: {
      type: String,
    },
    summary: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    contextLinks: [{
      type: String,
    }],
    contextText: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
callSchema.index({ userId: 1, createdAt: -1 });
callSchema.index({ expertId: 1 });
callSchema.index({ status: 1 });

const Call = mongoose.model<ICall>('Call', callSchema);

export default Call; 