import z from "zod";

export const orderSchema = z.object({
	cartId: z.string().optional(),
	productId: z.string().min(1),
	quantity: z.coerce.number().min(1),
});

export type OrderSchemaType = z.infer<typeof orderSchema>;
