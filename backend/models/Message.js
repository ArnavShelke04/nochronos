import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["chat", "system"],
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Pool", 
      required: function () {
        return this.type === "chat"; 
      }, 
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "system" && !this.groupId;
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        // System messages don't need an author (they come from the app)
        return this.type === "chat";
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      action: { 
        type: String,
        enum: ["payment_required", "member_added", "payment_done", "welcome_back"],
      },
      targetUserId: { type: Schema.Types.ObjectId, ref: "User" },
      poolId: { type: Schema.Types.ObjectId, ref: "Pool" },
      amount: { type: Number } 
    },
  },
  {
    timestamps: true,
  }
);


messageSchema.index({ groupId: 1, createdAt: -1 });


messageSchema.index({ recipientId: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);