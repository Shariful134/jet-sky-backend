import { z } from "zod";
import mongoose from "mongoose";


const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });

// Create AdventurePack Schema
const adventurePackCreateSchema = z.object({
  body: z.object({
    jet_skyId: objectId, 

    title: z
      .string("Title is required")
      .nonempty("Title cannot be empty")
      .trim(),

    discountPercentage: z.preprocess(
      (val) => Number(val),
      z
        .number("Discount percentage is required")
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot be more than 100")
    ),

    ridesPricing3: z.preprocess(
      (val) => Number(val),
      z.number("3-ride pricing is required").positive(
        "3-ride pricing must be greater than 0"
      )
    ),

    ridesPricing5: z.preprocess(
      (val) => Number(val),
      z.number("5-ride pricing is required").positive(
        "5-ride pricing must be greater than 0"
      )
    ),

    ridesPricing8: z.preprocess(
      (val) => Number(val),
      z.number("8-ride pricing is required").positive(
        "8-ride pricing must be greater than 0"
      )
    ),

    refundAmount: z.preprocess(
      (val) => Number(val),
      z.number("Refund amount is required" ).nonnegative(
        "Refund amount cannot be negative"
      )
    ),

    feature_list: z
      .array(z.string())
      .nonempty("Feature list cannot be empty")
      .optional(), 
  }),
});

// Update AdventurePack Schema
const adventurePackUpdateSchema = z.object({
  body: z.object({
    jet_skyId: objectId.optional(),

    title: z.string().trim().optional(),

    discountPercentage: z
      .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().min(0).max(100))
      .optional(),

    ridesPricing3: z
      .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().positive())
      .optional(),

    ridesPricing5: z
      .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().positive())
      .optional(),

    ridesPricing8: z
      .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().positive())
      .optional(),

    refundAmount: z
      .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().nonnegative())
      .optional(),

    feature_list: z.array(z.string()).optional(),
  }),
});

export const adventurePackValidation = {
  adventurePackCreateSchema,
  adventurePackUpdateSchema,
};
