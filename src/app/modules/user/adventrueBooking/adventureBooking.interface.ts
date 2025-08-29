import { Types } from "mongoose";

// export interface IbookingAdventurePack {
// adventurePackId: Types.ObjectId;
// userId: Types.ObjectId;
// ridesNumber:number;
// ridesPricing:number;
// startDate:Date;
// expireDate:Date;
// rideComplete:number;
// rideRemaining:number;
// }

export interface IbookingAdventurePack {
  _id?: string;
  userId: Types.ObjectId;        // Ref to User
  jet_skyId: Types.ObjectId;     // Ref to JetSky
  adventurePackId: Types.ObjectId; // Ref to AdventurePack
  purchasedCredits: number;
  remainingCredits: number;
  startDate: Date;      // auto calculate 24 months
  expiryDate: Date;      // auto calculate 24 months
  paymentStatus: "paid" | "unpaid";
  status: "active" | "expired" | "cancelled";
}
