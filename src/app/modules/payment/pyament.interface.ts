import { Types } from "mongoose";

export interface IPayment {
  _id?: string;
  userId: Types.ObjectId;
  adventurePurchaseId?: Types.ObjectId; 
  rentPurchaseId?: Types.ObjectId; 
  ridesNumber?:number;
  price:number;
  jetSkyId?: Types.ObjectId; 
  bookingId?: Types.ObjectId; 
  type: "recurring" | "onetime";
  stripePaymentIntentId?: string;
  status: "active" | "pending" | "cancel_requested" | "canceled" | "expired";
  startDate: Date;
  endDate: Date;
}
