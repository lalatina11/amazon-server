import { faker } from "@faker-js/faker";
import { textToCapitalized } from "../../lib/index.js";
import { db } from "../index.js";
import { tables } from "../tables.js";

const dummyProductName = [
	"shoes",
	"shirt",
	"hat",
	"pants",
	"jacket",
	"bags",
] as const;

function fakeProductImageGenerator(name: (typeof dummyProductName)[number]) {
	switch (name) {
		case "shoes": {
			const randomShoesImage = [
				"https://images.pexels.com/photos/2918534/pexels-photo-2918534.jpeg",
				"https://images.pexels.com/photos/17695225/pexels-photo-17695225.jpeg",
				"https://images.pexels.com/photos/5088874/pexels-photo-5088874.jpeg",
				"https://images.pexels.com/photos/27113462/pexels-photo-27113462.jpeg",
				"https://images.pexels.com/photos/29737094/pexels-photo-29737094.jpeg",
			] as const;
			return faker.helpers.arrayElement(randomShoesImage);
		}
		case "shirt": {
			const randomShirtImage = [
				"https://images.pexels.com/photos/31842962/pexels-photo-31842962.jpeg",
				"https://images.pexels.com/photos/2249248/pexels-photo-2249248.jpeg",
				"https://images.pexels.com/photos/18265935/pexels-photo-18265935.jpeg",
				"https://images.pexels.com/photos/17117893/pexels-photo-17117893.jpeg",
				"https://images.pexels.com/photos/17117891/pexels-photo-17117891.jpeg",
			] as const;
			return faker.helpers.arrayElement(randomShirtImage);
		}
		case "hat": {
			const randomHatImage = [
				"https://images.pexels.com/photos/36325463/pexels-photo-36325463.jpeg",
				"https://images.pexels.com/photos/34703279/pexels-photo-34703279.jpeg",
				"https://images.pexels.com/photos/19272485/pexels-photo-19272485.jpeg",
				"https://images.pexels.com/photos/20295253/pexels-photo-20295253.jpeg",
				"https://images.pexels.com/photos/35185/hats-fedora-hat-manufacture-stack.jpg",
			] as const;
			return faker.helpers.arrayElement(randomHatImage);
		}
		case "pants": {
			const randomPantsImage = [
				"https://images.pexels.com/photos/23947088/pexels-photo-23947088.jpeg",
				"https://images.pexels.com/photos/3366377/pexels-photo-3366377.jpeg",
				"https://images.pexels.com/photos/18752861/pexels-photo-18752861.jpeg",
				"https://images.pexels.com/photos/35043252/pexels-photo-35043252.jpeg",
				"https://images.pexels.com/photos/5872070/pexels-photo-5872070.jpeg",
			] as const;
			return faker.helpers.arrayElement(randomPantsImage);
		}
		case "jacket": {
			const randomjacketsImage = [
				"https://images.pexels.com/photos/18838615/pexels-photo-18838615.jpeg",
				"https://images.pexels.com/photos/20320482/pexels-photo-20320482.jpeg",
				"https://images.pexels.com/photos/10593216/pexels-photo-10593216.jpeg",
				"https://images.pexels.com/photos/9242080/pexels-photo-9242080.jpeg",
				"https://images.pexels.com/photos/20162729/pexels-photo-20162729.jpeg",
			] as const;
			return faker.helpers.arrayElement(randomjacketsImage);
		}
		case "bags": {
			const randomBagsImage = [
				"https://images.pexels.com/photos/29359844/pexels-photo-29359844.jpeg",
				"https://images.pexels.com/photos/4063545/pexels-photo-4063545.jpeg",
				"https://images.pexels.com/photos/7634323/pexels-photo-7634323.jpeg",
				"https://images.pexels.com/photos/4167659/pexels-photo-4167659.jpeg",
				"https://images.pexels.com/photos/9628538/pexels-photo-9628538.jpeg",
			] as const;
			return faker.helpers.arrayElement(randomBagsImage);
		}
		default:
			return "";
	}
}

const productSeeder = async () => {
	console.log("Starting product seeder...");
	console.log("Creating product data...");
	const sellerIds = await db.query.user.findMany({
		where: (t, { eq }) => eq(t.role, "seller"),
		columns: {
			id: true,
		},
	});
	for (const seller of sellerIds) {
		console.log(`Creating product data for seller ${seller.id}`);
		const products = Array.from({ length: 5 }).map(() => {
			const id = faker.string.uuid();
			console.log(`Creating product ${id}`);
			const fakeProductName = faker.helpers.arrayElement(dummyProductName);
			const image = fakeProductImageGenerator(fakeProductName);
			return {
				id,
				sellerId: seller.id,
				name: `${faker.company.name()} ${textToCapitalized(fakeProductName)}`,
				description: faker.commerce.productDescription(),
				price: faker.commerce.price({ min: 50_000, max: 1_000_000 }),
				image,
			};
		}) satisfies Array<typeof tables.product.$inferInsert>;
		console.log(`Inserting product data for seller ${seller.id}`);
		await db.insert(tables.product).values(products);
		console.log(`Product data for seller ${seller.id} inserted!`);
	}
	console.log("Product seeder completed");
};

export default productSeeder;
