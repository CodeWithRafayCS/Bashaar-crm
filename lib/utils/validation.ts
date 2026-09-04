import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const activityFormSchema = z.object({
  channel: z.string().min(1, "Please select a channel"),
  outcome: z.string().min(1, "Please select an outcome"),
  notes: z.string().optional(),
});
