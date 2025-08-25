import { z } from "zod";

const jetSkyCreateSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(1, "Name cannot be empty")
      .trim(),

    model: z
      .string({
        required_error: "Model is required",
        invalid_type_error: "Model must be a string",
      })
      .min(1, "Model cannot be empty")
      .trim(),

    hp: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Horsepower is required",
        invalid_type_error: "Horsepower must be a number",
      }).positive("Horsepower must be greater than 0")
    ),

    price: z.preprocess(
      (val) => Number(val),
      z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      }).positive("Price must be greater than 0")
    ),

    description: z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
      })
      .min(1, "Description cannot be empty")
      .trim(),

    image: z
      .string({
        required_error: "Image is required",
        invalid_type_error: "Image must be a string",
      })
      .min(1, "Image cannot be empty")
      .trim()
      .optional(),
  }),
});

// Update JetSky Schema (all fields optional)
const jetSkyUpdateSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    model: z.string().trim().optional(),

    hp: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number({
        required_error: "Horsepower is required",
        invalid_type_error: "Horsepower must be a number",
      }).positive("Horsepower must be greater than 0")
    ).optional(),

    price: z.preprocess(
      (val) => (val !== undefined ? Number(val) : val),
      z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      }).positive("Price must be greater than 0")
    ).optional(),

    description: z.string().trim().optional(),

    image: z
      .string({
        required_error: "Image URL Link is required",
        invalid_type_error: "Image must be a string",
      })
      .trim()
      .optional(),
  }),
});

export const jetSkyValidation = {
  jetSkyCreateSchema,
  jetSkyUpdateSchema,
};
