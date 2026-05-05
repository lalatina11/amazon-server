import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import * as authSchema from "../db/schema/auth-schema.js";
import * as mainSchema from "../db/schema/index.js";
import * as relations from "../db/schema/relations.js";
import { env } from "../lib/env.js";

// You can specify any property from the mysql2 connection options
export const db = drizzle(env.DATABASE_URL, {
	schema: { ...mainSchema, ...authSchema, ...relations },
	mode: "default",
});
