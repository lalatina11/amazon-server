import { and, eq } from "drizzle-orm";
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

	const user = req.user;

	if (!user) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
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

	const countExistingCart = await db.$count(
		tables.cart,
		and(
			eq(tables.cart.productId, validation.data.productId),
			eq(tables.cart.userId, user.id),
		),
	);

	if (countExistingCart > 0) {
		return res.status(400).json({
			success: false,
			message: "Produk ini sudah masuk ke dalam keranjang anda",
			data: null,
		});
	}

	const cartId = crypto.randomUUID();

	await db.insert(tables.cart).values({
		userId: user.id || "",
		id: cartId,
		productId: validation.data.productId,
		quantity: validation.data.qty,
	});
	return res
		.status(201)
		.json({ success: true, message: "Berhasil", data: null });
});

r.get("/", authMiddleware, userOnlyMiddleware, async (req, res) => {
	const user = req.user;
	if (!user) {
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized", data: null });
	}
	const carts = await db.query.cart.findMany({
		with: { product: true },
		orderBy: (t, { desc }) => desc(t.createdAt),
	});
	const data = carts.map((cart) => {
		return { ...cart, totalPrice: cart.quantity * Number(cart.product.price) };
	});
	return res.json({ success: true, message: "Berhasil", data });
});

export default cartRoute;
