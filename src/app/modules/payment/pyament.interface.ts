import { Types } from "mongoose";

export interface IPayment {
  _id?: string;
  userId: Types.ObjectId;
  adventurePackId?: Types.ObjectId; 
  ridesNumber?:number;
  price:number;
  rentId?: Types.ObjectId; 
  type: "recurring" | "onetime";
  stripePaymentIntentId?: string;
  status: "active" | "pending" | "cancel_requested" | "canceled" | "expired";
  startDate: Date;
  endDate: Date;
}
