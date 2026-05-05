import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import authRepository from "../lib/validation/auth-repository.js";

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = await authRepository.getCurrentUser(
			fromNodeHeaders(req.headers),
		);
		if (!session.success) {
			return res.json({
				success: false,
				message: "Unauthorized",
				data: null,
			});
		}
		req.user = session.data?.user;
		req.session = session.data?.session;
		next();
	} catch {
		return res.json({
			success: false,
			message: "Unauthorized",
			data: null,
		});
	}
};

export default authMiddleware;
