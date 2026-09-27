import mongoose from "mongoose";
const { Schema } = mongoose;

const poolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subscription: {
      name: {
        type: String,
        required: true,
      },
      monthly_cost: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      billingCycle: {
        type: String,
        enum: ["Monthly", "Annually"],
        default: "Monthly",
      },
    },

    maxMembers: {
      type: Number,
      required: true,
      min: [2, "A pool must have at least 2 slots"],
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR"],
      default: "USD",
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Full", "Closed"],
      default: "Active",
    },

    renewalDay: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

poolSchema.methods.compareDates = function (passedDate) {
  if (!passedDate) return null;
  const created = this.createdAt;

  const isSameDay = created.getDate() === passedDate.getDate();

  return isSameDay;
};

export const Pool = mongoose.model("Pool", poolSchema);