import { Types } from "mongoose";

export interface IBooking {
     _id?: string;
      userId: Types.ObjectId;        
      jetSkyId?: Types.ObjectId;     
      adventurePackId?: Types.ObjectId; 
      paymentId?: Types.ObjectId; 
      subscriptionId?: Types.ObjectId; 
      purchesCredits: number;
      remainingCredits: number;
      bookingDate?:Date;
      bookingTime?:string;
      stripePaymentIntentId?:string;
      drivingLicense?:string;
      startDate: Date;      
      expiryDate?: Date;      
      paymentStatus: "paid" | "unpaid";
      price:number;
      status:"inActive" | "active" | "expired" | "cancelled";
      
}