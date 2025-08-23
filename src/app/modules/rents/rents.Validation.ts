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
        model: z
            .string("Model is required")
            .nonempty("Model cannot be empty")
            .trim(),

        hp: z
            .string("Horsepower is required")
            .nonempty("Horsepower cannot be empty")
            .trim(),

        features: z
            .string("Features are required")
            .nonempty("Features cannot be empty")
            .trim(),

        pricing: z.preprocess(
            (val) => Number(val),
            z.number("Pricing is required")
                .positive("Pricing must be greater than 0")
        ),
        feature_list: z
            .array(z.string())
            .nonempty("Feature list cannot be empty")


    }),
});

// Update Rent Schema
const rentUpdateSchema = z.object({
    body: z.object({
        model: z.string().trim().optional(),

        hp: z.string().trim().optional(),

        features: z.string().trim().optional(),

        pricing: z.preprocess(
            (val) => (val !== undefined ? Number(val) : val),
            z.number().positive("Pricing must be greater than 0")
        ).optional(),

        feature_list: z
            .array(z.string())
            .nonempty("Feature list cannot be empty").optional()
    }),
});

export const rentValidation = {
    rentCreateSchema,
    rentUpdateSchema,
};
