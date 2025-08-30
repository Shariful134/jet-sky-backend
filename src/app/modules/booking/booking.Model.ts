
import { model, Schema } from "mongoose";
import { IBooking } from "./booking.Interface";



const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jetSkyId: {
      type: Schema.Types.ObjectId,
      ref: "JetSky",
      required: false,
    },
    adventurePurchaseId: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseAdventurePack",
      required: false,
    },
    adventurePackId: {
      type: Schema.Types.ObjectId,
      ref: "AdventurePack",
      required: false,
    },
    rentPackId: {
      type: Schema.Types.ObjectId,
      ref: "Rent",
      required: false,
    },
    rentPurchaseId: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseRentPack",
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
    ridesNumber: { type: Number, required: false },
    purchesCredits: { type: Number, required: false },
    remainingCredits: { type: Number, required: false },
    bookingDate:{type:Date, required:false},
    bookingTime:{type:String, required:false},
    type:{type:String, required:false},
    stripePaymentIntentId:{type:String, required:false},
    drivingLicense:{type:String, required:false},
    startDate: { type: Date, required: false },
    expiryDate: { type: Date, required: false },
    status: {
      type: String,
      enum: ["inActive" ,"active", "expired", "cancelled"],
      default: "inActive",
    },
    price: {
      type: Number,
     required:false
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
export const PurchaseAdventurePack = model<IBooking>("PurchaseAdventurePack", bookingSchema);
export const PurchaseRentPack = model<IBooking>("PurchaseRentPack", bookingSchema);
