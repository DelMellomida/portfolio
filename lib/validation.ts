import { z } from "zod";

/** Shared by the client form and the API route so the rules can't drift apart. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "That name is too long"),
  email: z.email("Please enter a valid email address").max(160),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a bit more — at least 20 characters")
    .max(4000, "That's a bit long; please keep it under 4000 characters"),
  /** Honeypot: real users never see this field, so any value means a bot. */
  company: z.string().max(0).optional(),
  /** Client timestamp of form mount, used to reject instant submissions. */
  startedAt: z.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
