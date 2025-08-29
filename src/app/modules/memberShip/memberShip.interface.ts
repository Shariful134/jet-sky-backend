import { Types } from "mongoose";

export interface IMemberShip {
  _id?: Types.ObjectId;

  name?: string; // e.g., "Weekly Pass", "6-Month Package"

  type?: "recurring" | "onetime"; // subscription type

  interval?: "day" | "week" | "month" | "year"; // only for recurring
  weekCount?: number;

  durationInMonths?: number; // only for onetime

  ridesPerMonth: number;

  refundableDeposit: number;

  signUpFee: number;

  price: number; // renamed from pricing for clarity

  planId: string;
  description: string;
}
