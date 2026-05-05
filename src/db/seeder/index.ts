import { db } from "../index.js";
import productSeeder from "./product-seeder.js";
import userSeeder from "./user-seeder.js";

async function main() {
	await userSeeder();
	await productSeeder();
}

main()
	.catch((err) => {
		console.log(err);
		process.exit(1);
	})
	.then(() => {
		db.$client.end();
	});
