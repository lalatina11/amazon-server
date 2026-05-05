import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer } from "better-auth/plugins";
import { db } from "../db/index.js";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "mysql", // or "postgresql", "sqlite"
	}),
	plugins: [bearer(), admin()],
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			address: {
				type: "string",
				required: false,
				defaultValue: "",
			},
		},
	},
});
