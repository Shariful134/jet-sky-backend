import mongoose from "mongoose";
import { z } from "zod";

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });

// Create Rent Schema
const rentCreateSchema = z.object({
  body: z.object({
    jet_skyId: objectId,

    model: z.string().nonempty("Model is required").trim(),

    hp: z.any().refine(
      (val) => typeof val === "string",
      { message: "hp must be a string, but received number" }
    ),

    price: z.preprocess(
      (val) => Number(val),
      z.number().positive("Pricing must be greater than 0")
    ),

    feature_list: z
      .array(z.string())
      .nonempty("Feature list cannot be empty"),
  }),
});

// Update Rent Schema
const rentUpdateSchema = z.object({
  body: z.object({
    model: z.string().trim().optional(),

    hp: z.string().refine(
      (val) => typeof val === "string",
      { message: "hp must be a string, but received number" }
    ).optional(),
    price: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number().positive("Price must be greater than 0")
    ).optional(),

    feature_list: z.array(z.string()).nonempty("Feature list cannot be empty").optional(),
  }),
});

export const rentValidation = {
  rentCreateSchema,
  rentUpdateSchema,
};
