import { Types } from "mongoose";

export interface ISubscription {
  _id?: string;
  userId: Types.ObjectId;
  membershipId: Types.ObjectId;

  type: "recurring" | "onetime";

  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;

  status: "active" | "pending" | "cancel_requested" | "canceled" | "expired";

  startDate: Date;
  endDate: Date;

  signUpFeePaid: boolean;
  refundableDepositPaid: boolean;

  refundAmount: number;
  damagesDeducted: number;
  canceledAt?: Date;
}
