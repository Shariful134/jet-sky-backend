import { z } from "zod";

// Create MemberShip Schema
const memberShipCreateSchema = z.object({
  body: z.object({
    duration: z.preprocess(
      (val) => Number(val),
      z.number("Duration is required")
        .positive("Duration must be greater than 0")
    ),

    ridesPerMonth: z.preprocess(
      (val) => Number(val),
      z.number("Rides per month is required")
        .positive("Rides per month must be greater than 0")
    ),

    refundableDeposit: z.preprocess(
      (val) => Number(val),
      z.number("Refundable deposit is required")
        .nonnegative("Refundable deposit cannot be negative")
    ),

    signUpFee: z.preprocess(
      (val) => Number(val),
      z.number("Sign-up fee is required")
        .nonnegative("Sign-up fee cannot be negative")
    ),

    pricing: z.preprocess(
      (val) => Number(val),
      z.number("Pricing is required")
        .positive("Pricing must be greater than 0")
    ),

    description: z
      .string("Description is required")
      .nonempty("Description cannot be empty")
      .trim(),
  }),
});

// Update MemberShip Schema (all fields optional)
const memberShipUpdateSchema = z.object({
  body: z.object({
    duration: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("Duration must be greater than 0")
    ).optional(),

    ridesPerMonth: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("Rides per month must be greater than 0")
    ).optional(),

    refundableDeposit: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().nonnegative("Refundable deposit cannot be negative")
    ).optional(),

    signUpFee: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().nonnegative("Sign-up fee cannot be negative")
    ).optional(),

    pricing: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("Pricing must be greater than 0")
    ).optional(),

    description: z.string().trim().optional(),
  }),
});

export const memberShipValidation = {
  memberShipCreateSchema,
  memberShipUpdateSchema,
};
