import z from "zod";

const registerSchema = z.object({
	name: z.string({ message: "Nama dibutuhkan" }),
	email: z.email({ message: "Email tidak valid" }),
	password: z
		.string({ message: "Password dibutuhkan" })
		.min(8, { message: "Password minimal 8 karakter" })
		.max(32, { message: "Password maksimal 32 karakter" }),
});

const loginSchema = registerSchema.omit({ name: true });

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, registerSchema };
