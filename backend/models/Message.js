import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  type: {
    type: String,
    enum: ['chat', 'system'], 
    required: true
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: function() { return this.type === 'chat'; } // Only required for group chats
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type === 'chat'; }
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  //SYSTEM MESSAGES METADATA (Optional but great)
  // If a system message says "Alex added Bob to the group", you can store references here
  metadata: {
    action: { type: String }, // e.g., 'MEMBER_ADDED', 'EXPENSE_SPLIT'
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User' }
  }

}, {
  timestamps: true 
});

// Indexing for ultra-fast WebSocket fetches (sorts messages by group and time)
messageSchema.index({ groupId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);