
import { model, Schema } from "mongoose";
import { IBooking } from "./booking.Interface";



const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    JetSkyId: {
      type: Schema.Types.ObjectId,
      ref: "JetSky",
      required: false,
    },
    adventurePackId: {
      type: Schema.Types.ObjectId,
      ref: "AdventurePack",
      required: false,
    },
    rentId: {
      type: Schema.Types.ObjectId,
      ref: "Rent",
      required: false,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },
    purchasedCredits: { type: Number, required: true },
    remainingCredits: { type: Number, required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    price: {
      type: Number,
     required:false
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
    },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
