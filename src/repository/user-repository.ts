import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { tables } from "../db/tables.js";

const userRepository = {
	checkExistingEmail: async (email: string) => {
		const count = await db.$count(tables.user, eq(tables.user.email, email));
		return count > 0;
	},
};

export default userRepository;
