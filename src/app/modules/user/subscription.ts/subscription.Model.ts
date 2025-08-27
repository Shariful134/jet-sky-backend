import mongoose, { Schema, model } from "mongoose";
import { ISubscription } from "./subscription.Interface";


const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: "MemberShip",
      required: true,
    },

    type: {
      type: String,
      enum: ["recurring", "onetime"],
      required: true,
    },

    stripeSubscriptionId: { type: String }, // only for recurring
    stripePaymentIntentId: { type: String }, // used for onetime or signup fee

    status: {
      type: String,
      enum: ["active", "pending", "canceled", "expired"],
      default: "pending",
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    signUpFeePaid: { type: Boolean, default: false },
    refundableDepositPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
