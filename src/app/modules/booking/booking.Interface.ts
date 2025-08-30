import { Types } from "mongoose";

export interface IBooking {
     _id?: string;
      userId: Types.ObjectId;        
      jetSkyId?: Types.ObjectId;     
      adventurePackId?: Types.ObjectId; 
      rentPackId?: Types.ObjectId; 
      adventurePurchaseId?: Types.ObjectId; 
      rentPurchaseId?: Types.ObjectId; 
      paymentId?: Types.ObjectId; 
      subscriptionId?: Types.ObjectId; 
      ridesNumber?: number;
      purchesCredits?: number;
      remainingCredits?: number;
      bookingDate?:Date;
      bookingTime?:string;
      type?:string;
      stripePaymentIntentId?:string;
      drivingLicense?:string;
      startDate: Date;      
      expiryDate?: Date;      
      paymentStatus: "paid" | "unpaid";
      price:number;
      status:"inActive" | "active" | "expired" | "cancelled";
      
}