import { z } from "zod";

// Create MemberShip Schema
const memberShipCreateSchema = z.object({

  body: z.object({
    durationInMonths: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Duration is required",
        invalid_type_error: "Duration must be a number",
      }).positive("Duration must be greater than 0")
    ),
     weekCount: z.number().optional(),

    ridesPerMonth: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Rides per month is required",
        invalid_type_error: "Rides per month must be a number",
      }).positive("Rides per month must be greater than 0").max(5, "Rides per month cannot be more than 5")
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

    price: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Pricing is required",
        invalid_type_error: "price must be a number",
      }).positive("price must be greater than 0")
    ),

    planId: z
      .string({
        required_error: "planId is required",
        invalid_type_error: "planId must be a string",
      })
      .min(1, "planId cannot be empty")
      .trim(),
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
    durationInMonths: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("Duration must be greater than 0")
    ).optional(),

    weekCount: z.number().optional(),

    ridesPerMonth: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("Rides per month must be greater than 0")
    ).optional(),

    refundableDeposit: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().nonnegative("Refundable deposit cannot be negative").max(5, "Rides per month cannot be more than 5")
    ).optional(),

    signUpFee: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().nonnegative("Sign-up fee cannot be negative")
    ).optional(),

    price: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("price must be greater than 0")
    ).optional(),

    planId: z.string().trim().optional(),
    description: z.string().trim().optional(),
  }),
});

export const memberShipValidation = {
  memberShipCreateSchema,
  memberShipUpdateSchema,
};
