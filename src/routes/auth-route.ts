import { fromNodeHeaders } from "better-auth/node";
import express, { type Router } from "express";
import authRepository from "../lib/validation/auth-repository.js";
import { loginSchema, registerSchema } from "../lib/validation/auth-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import userRepository from "../repository/user-repository.js";

const authRoute: Router = express.Router();

const r = authRoute;

r.get("/user", (_, res) => {
	res.json({ name: "candra" });
});

r.post("/register", async (req, res) => {
	const body = req.body;
	const validation = registerSchema.safeParse(body);
	if (!validation.success) {
		return res.status(400).json({
			success: false,
			error: validation.error.issues[0]?.message,
			data: null,
		});
	}
	const countExistingEmail = await userRepository.checkExistingEmail(
		validation.data.email,
	);
	if (countExistingEmail) {
		return res
			.status(400)
			.json({ success: false, error: "Email already exists", data: null });
	}

	const response = await authRepository.register(validation.data);
	if (!response.success) {
		return res
			.status(400)
			.json({ success: false, error: response.message, data: null });
	}
	return res
		.status(201)
		.json({ success: true, message: response.message, data: response.data });
});

r.post("/login", async (req, res) => {
	const body = req.body;
	const validation = loginSchema.safeParse(body);
	if (!validation.success) {
		return res.status(400).json({
			success: false,
			error: validation.error.issues[0]?.message,
			data: null,
		});
	}
	const isEmailExists = await userRepository.checkExistingEmail(
		validation.data.email,
	);
	if (!isEmailExists) {
		return res.status(400).json({
			success: false,
			error: "Email tidak ditemukan",
			data: null,
		});
	}
	const response = await authRepository.login(validation.data);
	if (!response.success) {
		return res.status(400).json({
			success: false,
			message: response.message,
			data: null,
		});
	}
	return res
		.status(200)
		.json({ success: true, message: response.message, data: response.data });
});

r.get("/current-user", authMiddleware, async (req, res) => {
	return res.json({ success: true, message: "User found", data: req.user });
});

r.delete("/logout", authMiddleware, async (req, res) => {
	const response = await authRepository.logout(fromNodeHeaders(req.headers));
	if (!response.success) {
		return res.status(400).json({
			success: false,
			error: response.message,
			data: null,
		});
	}
	return res.json({
		success: true,
		message: "Logout successful",
		data: null,
	});
});

export default authRoute;
