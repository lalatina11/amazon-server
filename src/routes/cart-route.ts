import { eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/index.js";
import { tables } from "../db/tables.js";
import { addToCartSchema } from "../lib/validation/cart-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import userOnlyMiddleware from "../middleware/user-only-middleware.js";

const cartRoute: Router = Router();

const r = cartRoute;

r.post("/add-to-cart", authMiddleware, userOnlyMiddleware, async (req, res) => {
	const validation = addToCartSchema.safeParse(req.body);

	if (!validation.success) {
		return res.status(400).json({
			success: false,
			message: validation.error.issues[0]?.message,
			data: null,
		});
	}

	const countValidProductId = await db.$count(
		tables.product,
		eq(tables.product.id, validation.data.productId),
	);

	if (countValidProductId < 1) {
		return res.status(400).json({
			success: false,
			message: "Produk tidak valid",
			data: null,
		});
	}

	const cartId = crypto.randomUUID();

	await db
		.insert(tables.cart)
		.values({
			userId: req.user?.id || "",
			id: cartId,
			productId: validation.data.productId,
			quantity: validation.data.qty,
		})
		.$returningId();
	return res
		.status(201)
		.json({ succes: true, message: "Berhasil", data: null });
});

r.get("/", authMiddleware, userOnlyMiddleware, async (req, res) => {
	const user = req.user;
	if (!user) {
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized", data: null });
	}
	const carts = await db.query.cart.findMany({ with: { product: true } });
	const data = carts.map((cart) => {
		return { ...cart, totalPrice: cart.quantity * Number(cart.product.price) };
	});
	return res.json({ success: true, message: "Berhasil", data });
});

export default cartRoute;
