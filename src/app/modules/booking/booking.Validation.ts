import { z } from "zod";
import mongoose from "mongoose";

const objectId = z
  .string({
    required_error: "ObjectId is required",
    invalid_type_error: "ObjectId must be a string",
  })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });

 const adventurePackBookingValidation = z.object({
  body: z.object({
    userId: objectId,
    adventurePackId: objectId.optional(),

    ridesNumber: z.preprocess(
      (val) => Number(val),
      z
        .number({
          required_error: "Rides number is required",
          invalid_type_error: "Rides number must be a number",
        })
        .int("Rides number must be an integer")
        .positive("Rides number must be greater than 0")
    ),

    price: z.preprocess(
      (val) => Number(val),
      z
        .number({
          required_error: "Price is required",
          invalid_type_error: "Price must be a number",
        })
        .positive("Price must be greater than 0")
    ),
  }),
});

 const jetSkyBookingValidation = z.object({
  body: z.object({
    userId: objectId,
    jetSkyId: objectId.optional(),
    price: z.preprocess(
      (val) => Number(val),
      z
        .number({
          required_error: "Price is required",
          invalid_type_error: "Price must be a number",
        })
        .positive("Price must be greater than 0")
    ),
  }),
});

// export const paymentUpdateSchema = z.object({
//   body: z.object({
//     userId: objectId.optional(),
//     adventurePackId: objectId.optional(),
//     rentId: objectId.optional(),

//     ridesNumber: z
//       .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().int().positive())
//       .optional(),

//     price: z
//       .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().positive())
//       .optional(),
//   }),
// });

export const BookingValidation = {
  adventurePackBookingValidation,
  jetSkyBookingValidation
//   paymentUpdateSchema,
};
