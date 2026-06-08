import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});
