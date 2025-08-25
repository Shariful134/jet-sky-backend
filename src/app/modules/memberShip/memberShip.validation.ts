import { z } from "zod";

// Create MemberShip Schema
const memberShipCreateSchema = z.object({
  body: z.object({
    duration: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Duration is required",
        invalid_type_error: "Duration must be a number",
      }).positive("Duration must be greater than 0")
    ),

    ridesPerMonth: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Rides per month is required",
        invalid_type_error: "Rides per month must be a number",
      }).positive("Rides per month must be greater than 0")
    ),

    refundableDeposit: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Refundable deposit is required",
        invalid_type_error: "Refundable deposit must be a number",
      }).nonnegative("Refundable deposit cannot be negative")
    ),

    signUpFee: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Sign-up fee is required",
        invalid_type_error: "Sign-up fee must be a number",
      }).nonnegative("Sign-up fee cannot be negative")
    ),

    pricing: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Pricing is required",
        invalid_type_error: "Pricing must be a number",
      }).positive("Pricing must be greater than 0")
    ),

    description: z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .min(1, "Description cannot be empty")
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
