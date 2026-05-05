import z from "zod";
import "dotenv/config";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
	DATABASE_URL: z.string().min(1),
	UI_AVATARS: z.string().min(1),
});

const validation = envSchema.safeParse(process.env);

if (!validation.success) {
	console.error(validation.error);
	process.exit(1);
}

export const env = validation.data;
