import { Types } from "mongoose";

export interface IBooking {
     _id?: string;
      userId: Types.ObjectId;        
      JetSkyId?: Types.ObjectId;     
      adventurePackId?: Types.ObjectId; 
      rentId?: Types.ObjectId; 
      paymentId?: Types.ObjectId; 
      subscriptionId?: Types.ObjectId; 
      purchasedCredits: number;
      remainingCredits: number;
      startDate: Date;      
      expiryDate: Date;      
      paymentStatus: "paid" | "unpaid";
      price:number;
      status: "active" | "expired" | "cancelled";
      
}