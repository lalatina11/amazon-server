import { and, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { tables } from "../db/tables.js";

const userOnlyMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (req.user == null) {
		return res.json({ success: false, message: "Unauthorized", data: null });
	}

	const user = await db.$count(
		tables.user,
		and(eq(tables.user.role, "user"), eq(tables.user.id, req.user.id)),
	);

	if (user < 0) {
		return res.json({
			success: false,
			message: "Only User can access this action.",
			data: null,
		});
	}

	next();
};

export default userOnlyMiddleware;
