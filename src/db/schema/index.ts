import {
	decimal,
	int,
	mysqlEnum,
	mysqlTable,
	primaryKey,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/mysql-core";
import { user } from "./auth-schema.js";

export const category = mysqlTable("category", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const product = mysqlTable("product", {
	id: varchar("id", { length: 255 }).primaryKey(),
	sellerId: varchar("seller_id", { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	image: text("image").notNull(),
	createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const rating = mysqlTable(
	"rating",
	{
		id: varchar("id", { length: 255 }).primaryKey(),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		rate: int("rate").notNull(),
		productId: varchar("product_id", { length: 255 })
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(t) => [unique().on(t.userId, t.productId)],
);

export const productCategory = mysqlTable(
	"product_category",
	{
		productId: varchar("product_id", { length: 255 })
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		categoryId: varchar("category_id", { length: 255 })
			.notNull()
			.references(() => category.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.productId, t.categoryId] })],
);

export const cart = mysqlTable(
	"cart",
	{
		id: varchar("id", { length: 255 }).primaryKey(),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: varchar("product_id", { length: 255 })
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		quantity: int("quantity").notNull(),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(t) => [unique().on(t.userId, t.productId)],
);

export const order = mysqlTable("order", {
	id: varchar("id", { length: 255 }).primaryKey(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	status: mysqlEnum("status", [
		"PENDING",
		"PAID",
		"SHIPPED",
		"DELIVERED",
		"CANCELLED",
	])
		.default("PENDING")
		.notNull(),
	createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const orderItem = mysqlTable("order_item", {
	id: varchar("id", { length: 255 }).primaryKey(),
	orderId: varchar("order_id", { length: 255 })
		.notNull()
		.references(() => order.id, { onDelete: "cascade" }),
	productId: varchar("product_id", { length: 255 })
		.notNull()
		.references(() => product.id, { onDelete: "cascade" }),
	quantity: int("quantity").notNull(),
	priceAtPurchase: decimal("price_at_purchase", {
		precision: 10,
		scale: 2,
	}).notNull(),
	createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});
