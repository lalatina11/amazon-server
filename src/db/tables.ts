import * as authSchema from "./schema/auth-schema.js";
import * as indexSchema from "./schema/index.js";

export const tables = { ...indexSchema, ...authSchema };
