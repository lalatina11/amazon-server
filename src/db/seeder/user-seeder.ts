import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import authRepository from "../../lib/validation/auth-repository.js";
import { db } from "../index.js";
import { tables } from "../tables.js";

const allowedUserRole = ["admin", "user", "seller"] as const;

async function seedUserByRole(
	numberOfSeed: number,
	role: (typeof allowedUserRole)[number],
) {
	console.log(`Creating ${role} data... `);

	const users = Array.from({ length: numberOfSeed }).map((_, index) => {
		const name = faker.person.fullName();
		return {
			name,
			email: `${role}${index + 1}@email.com`,
			password: "password",
		};
	});

	console.log(`${role} data created! `);

	console.log(`Inserting ${role} data... `);
	for (const user of users) {
		console.log(`Inserting ${user.name}`);
		const res = await authRepository.register(user);
		if (!res.success || !res.data?.user) {
			throw new Error(`Failed to register new ${role}`);
		}
		await db
			.update(tables.user)
			.set({ role })
			.where(eq(tables.user.id, res.data.user.id));
		console.log(`${user.name} inserted! `);
	}
	console.log(`${role} data inserted! `);
	console.log(`${role} seeder completed`);
}

const userSeeder = async () => {
	const numberOfUser = 120;
	for (const role of allowedUserRole) {
		const numberOfSeed = numberOfUser / 3;
		await seedUserByRole(numberOfSeed, role);
	}
	console.log("Deleting session...");
	await db.delete(tables.session);
	console.log("Session deleted");
};

export default userSeeder;
