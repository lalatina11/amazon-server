import { Router } from "express";
import { db } from "../db/index.js";

const productRoute: Router = Router();

const r = productRoute;

r.get("/", async (_, res) => {
	const products = await db.query.product.findMany({
		with: { seller: true },
	});
	res.json({ success: true, message: "Success", data: products });
});

r.get("/:id", async (req, res) => {
	const id = req.params.id as string;
	const product = await db.query.product.findFirst({
		where: (t, { eq }) => eq(t.id, id),
		with: { seller: true },
	});
	res.json({ success: true, message: "Success", data: product });
});

export default productRoute;
