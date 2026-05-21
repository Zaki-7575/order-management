import { z } from "zod";

export const createOrderSchema = z.object({
  store_id: z.string().min(1, "Store ID is required"),

  total_amount: z.number().positive(),

  items: z
    .array(
      z.object({
        item_id: z.string().min(1),
        qty: z.number().min(1),
      })
    )
    .min(1, "At least one item is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PLACED",
    "PREPARING",
    "COMPLETED",
  ]),
});