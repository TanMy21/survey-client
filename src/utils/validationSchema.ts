import { z } from "zod";

export const elementSchema = z.object({
  emailContact: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Hmm… that doesn’t look like a valid email" }),
});

export const textResponseSchema = z.object({
  text: z.string().min(1, { message: "Oops! Looks like you missed this one 🙂" }),
});

export const numberResponseSchema = z.object({
  number: z
    .string()
    .min(1, { message: "Looks like you missed this one—please respond with a number 🙂" })
    .transform((value) => parseInt(value, 10))
    .refine((value) => !isNaN(value), {
      message: "Looks like that’s not a number—want to try again?",
    }),
});
