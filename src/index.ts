import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import morgan from "morgan";
import { db } from "./db/index.js";
import { tables } from "./db/tables.js";
import { env } from "./lib/env.js";
import logger from "./lib/logger.js";
import authRoute from "./routes/auth-route.js";
import cartRoute from "./routes/cart-route.js";
import orderRoute from "./routes/order-route.js";
import productRoute from "./routes/product-route.js";

const morganStream = {
	write: (message: string) => logger.http(message.trim()),
};
const app = express();

app.use(morgan("combined", { stream: morganStream }));

app.use(express.json());

app.get("/api/health", (_, res) => {
	res.json({ success: true, message: "Server is running", data: null });
});

app.get("/api/db", async (_, res) => {
	try {
		await db.$count(tables.user);
		res.json({ success: true, message: "Database is connected", data: null });
	} catch {
		res.status(500).json({
			success: false,
			message: "Database connection failed",
			data: null,
		});
	}
});

app.use("/api/auth", authRoute);

app.use("/api/products", productRoute);

app.use("/api/cart", cartRoute);

app.use("/api/order", orderRoute);

app.use((_, res) => {
	res
		.status(404)
		.json({ success: false, message: "Not Found Route", data: null });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	if (env.NODE_ENV === "production") {
		return res
			.status(500)
			.json({ success: false, message: "Something went wrong", data: null });
	}
	res.status(404).json({
		success: false,
		message: err.message || "Something went wrong",
		data: null,
	});
});

const PORT = env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
