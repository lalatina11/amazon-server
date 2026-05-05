import { relations } from "drizzle-orm";
import { user } from "./auth-schema.js";
import { cart, order, orderItem, product, rating } from "./index.js";

export const userRelation2 = relations(user, ({ many }) => ({
	products: many(product),
	orders: many(order),
	carts: many(cart),
	ratings: many(rating),
}));

export const productRelation = relations(product, ({ one, many }) => ({
	seller: one(user, {
		fields: [product.sellerId],
		references: [user.id],
	}),
	carts: many(cart),
	ratings: many(rating),
}));

export const cartRelation = relations(cart, ({ one }) => ({
	product: one(product, {
		fields: [cart.productId],
		references: [product.id],
	}),
	user: one(user, {
		fields: [cart.userId],
		references: [user.id],
	}),
}));

export const orderRelation = relations(order, ({ one, many }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
	items: many(orderItem),
}));

export const orderItemRelation = relations(orderItem, ({ one }) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id],
	}),
	product: one(product, {
		fields: [orderItem.productId],
		references: [product.id],
	}),
}));

export const ratingRelation = relations(rating, ({ one }) => ({
	user: one(user, {
		fields: [rating.userId],
		references: [user.id],
	}),
	product: one(product, {
		fields: [rating.productId],
		references: [product.id],
	}),
}));
