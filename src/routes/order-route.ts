import { eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/index.js";
import { tables } from "../db/tables.js";
import { orderSchema } from "../lib/validation/order-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import userOnlyMiddleware from "../middleware/user-only-middleware.js";

const orderRoute: Router = Router();

const r = orderRoute;

r.get("/", async (_req, res) => {
	const data = await db.query.order.findMany({
		with: { items: true },
	});
	res.json({ success: true, message: "Success", data });
});

r.post("/create", authMiddleware, userOnlyMiddleware, async (req, res) => {
	const validation = orderSchema.safeParse(req.body);

	if (!validation.success) {
		return res.status(400).json({
			success: false,
			message: validation.error.issues[0]?.message || "",
			data: null,
		});
	}

	if (!req.user) {
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized", data: null });
	}
	const { cartId, productId, quantity } = validation.data;

	const product = await db.query.product.findFirst({
		where: (t, { eq }) => eq(t.id, productId),
		columns: { id: true, price: true },
	});

	if (!product) {
		return res.status(400).json({
			success: false,
			message: "Produk tidak valid",
			data: null,
		});
	}

	if (cartId) {
		const cart = await db.query.cart.findFirst({
			where: (t, { eq }) => eq(t.id, cartId),
			columns: { id: true, productId: true },
		});

		if (cart) {
			if (cart.productId !== product.id) {
				return res.status(400).json({
					success: false,
					message: "Produk tidak valid",
					data: null,
				});
			}
			await db.delete(tables.cart).where(eq(tables.cart.id, cart.id));
		} else {
			return res.status(400).json({
				success: false,
				message: "Keranjang tidak valid",
				data: null,
			});
		}
	}

	const orderId = crypto.randomUUID();

	await db.insert(tables.order).values({ id: orderId, userId: req.user.id });

	await db.insert(tables.orderItem).values({
		id: crypto.randomUUID(),
		productId: product.id,
		orderId,
		quantity,
		priceAtPurchase: (Number(product.price) * quantity).toString(),
	});
	return res.json({ success: true, message: "Success", data: null });
});

r.patch("/pay/:id", async (req, res) => {
	const { id } = req.params;
	const orderCount = await db.$count(tables.order, eq(tables.order.id, id));
	if (orderCount < 1) {
		return res
			.status(400)
			.json({ success: false, message: "Order tidak ditemukan", data: null });
	}
	await db
		.update(tables.order)
		.set({ status: "PAID" })
		.where(eq(tables.order.id, id));
	return res.json({ success: true, message: "Success", data: null });
});

export default orderRoute;
