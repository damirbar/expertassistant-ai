import mongoose from 'mongoose';

// Expert Type Enum
export enum ExpertType {
  REALTOR = 'realtor',
  LENDER = 'lender',
  INSPECTOR = 'inspector',
  APPRAISER = 'appraiser',
  ATTORNEY = 'attorney',
  INSURANCE_AGENT = 'insurance_agent',
  OTHER = 'other'
}

// Expert Interface
export interface IExpert extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  expertType: ExpertType;
  company?: string;
  notes?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Expert Schema
const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please provide a valid phone number'],
    },
    expertType: {
      type: String,
      required: [true, 'Expert type is required'],
      enum: Object.values(ExpertType),
      default: ExpertType.OTHER,
    },
    company: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
expertSchema.index({ userId: 1, expertType: 1 });

const Expert = mongoose.model<IExpert>('Expert', expertSchema);

export default Expert; 