import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 digits").optional(),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  googleId: z.string().optional(),
  role: z.enum(["ADMIN", "CUSTOMER"]).default("CUSTOMER"),
  authProvider: z.enum(["local", "google", "both"]).default("local"),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
});
export const productSchema = z.object({
  name: z.string().min(3, "product name must be at least 3 characters"),
  description: z
    .string()
    .min(3, "description must be at least 3 characters")
    .optional(),
  price: z.coerce
    .number()
    .min(0.1, "Price must be at least 0.1")
    .multipleOf(0.01, "Price can have at most 2 decimal places"),
  stockQuantity: z.coerce.number().min(1).int(),
  categoryId: z.coerce.number().int(),
});
