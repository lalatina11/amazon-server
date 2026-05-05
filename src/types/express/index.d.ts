import type { Session, User } from "better-auth/types";

declare global {
	namespace Express {
		interface Request {
			user?: User | undefined;
			session?: Session | undefined;
		}
	}
}
