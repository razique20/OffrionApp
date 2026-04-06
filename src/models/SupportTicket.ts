import mongoose, { Schema, Document, Model } from 'mongoose';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface ISupportTicket extends Document {
  userId: mongoose.Types.ObjectId;
  userRole: 'merchant' | 'partner';
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  responses: {
    senderId: mongoose.Types.ObjectId;
    senderRole: 'admin' | 'merchant' | 'partner';
    message: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userRole: { type: String, enum: ['merchant', 'partner'], required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
    },
    responses: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        senderRole: { type: String, enum: ['admin', 'merchant', 'partner'], required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

export default SupportTicket;
