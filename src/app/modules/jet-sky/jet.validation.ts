import { z } from "zod";


const jetSkyCreateSchema = z.object({
    body: z.object({
        name: z
            .string()
            .nonempty("Name is required")
            .trim(),

        model: z
            .string()
            .nonempty("Model is required")
            .trim(),

        hp: z.preprocess(
            (val) => Number(val),
            z.number("Horsepower is required")
            .positive("Horsepower must be greater than 0")
        ),

        price: z.preprocess(
            (val) => Number(val),
            z.number("Price is required")
                .positive("Price must be greater than 0")
        ),
        description: z
            .string()
            .nonempty("Description is required")
            .trim(),

        image: z
            .string()
            .nonempty("Image is required")
            .trim().optional(),
    }),
});

// Update JetSky Schema (all fields optional)
const jetSkyUpdateSchema = z.object({
    body: z.object({
        name: z.string().trim().optional(),
        model: z.string().trim().optional(),
        hp: z.preprocess(
            (val) => Number(val), 
            z.number("Horsepower is required" )
            .positive("Horsepower must be greater than 0")
        ),

        price: z.preprocess(
            (val) => Number(val),
            z.number("Price is required" )
            .positive("Price must be greater than 0")
        ).optional(), 

        description: z.string().trim().optional(),
        image: z.string("Image URL Link is Requried").trim().optional(),
    }),
});

export const jetSkyValidation = {
    jetSkyCreateSchema,
    jetSkyUpdateSchema,
};
