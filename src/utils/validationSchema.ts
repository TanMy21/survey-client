import { z } from "zod";

export const elementSchema = z.object({
  emailContact: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Please enter a valid email" }),
});

export const textResponseSchema = z.object({
  text: z.string().min(1, { message: "Input field cannot be empty." }),
});

export const numberResponseSchema = z.object({
  number: z
    .string()
    .transform((value) => parseInt(value, 10))
    .refine((value) => !isNaN(value), {
      message: "Please enter a valid number.",
    }),
});
