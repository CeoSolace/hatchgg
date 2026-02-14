import { Schema, model, models, Types } from 'mongoose';

const TicketSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Pending', 'Closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  internalNotes: [
    {
      ts: { type: Date, default: Date.now },
      note: { type: String },
      adminUser: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    },
  ],
  assignedTo: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  agentTranscript: [
    {
      role: { type: String, enum: ['user', 'agent'], required: true },
      message: { type: String, required: true },
      ts: { type: Date, default: Date.now },
    },
  ],
  agentSummary: { type: String, default: '' },
  escalationReason: { type: String, enum: ['user_requested', 'no_match'], default: 'user_requested' },
  privateInfoKey: { type: String },
  privateInfoEncrypted: {
    ciphertext: String,
    iv: String,
    authTag: String,
  },
});

export default models.Ticket || model('Ticket', TicketSchema);