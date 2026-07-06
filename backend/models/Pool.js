import mongoose from 'mongoose';
const { Schema } = mongoose;

const poolSchema = new Schema({
  subscription: {
    name: { 
      type: String, 
      enum: ["Netflix", "Spotify", "Amazon Prime", "Disney+", "YouTube Premium", "Hulu", "Other"],
      required: true 
    },
    monthly_cost: { 
      type: Number, 
      required: true 
    },
    category: {
      type: String,
      enum: ["Entertainment", "Music", "Education", "Utilities", "Software"],
      required: true
    },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Annually"],
      default: "Monthly"
    }
  },

  maxMembers: {
    type: Number,
    required: true,
    min: [2, "A pool must have at least 2 slots"]
  },

  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "INR"],
    default: "USD"
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  status: {
    type: String,
    enum: ["Active", "Full", "Closed"],
    default: "Active"
  }
}, {
  timestamps: true 
});

export const Pool = mongoose.model('Pool', poolSchema);