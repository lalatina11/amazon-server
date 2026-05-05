import z from "zod";

export const addToCartSchema = z.object({
	productId: z.string().min(1),
	qty: z.coerce.number().min(1),
});

export type AddToCartSchemaType = z.infer<typeof addToCartSchema>;
