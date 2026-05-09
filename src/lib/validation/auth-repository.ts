import { faker } from "@faker-js/faker";
import { auth } from "../auth.js";
import { env } from "../env.js";
import type { LoginSchema, RegisterSchema } from "./auth-schema.js";

const authRepository = {
	register: async (body: RegisterSchema) => {
		try {
			const image = `${env.UI_AVATARS}/api/?name=${body.name.replace(" ", "+")}&background=random`;
			const res = await auth.api.signUpEmail({
				body: {
					...body,
					image,
					address: faker.location.streetAddress(),
				},
			});
			if (res == null || !res.token) {
				return {
					success: false,
					message: "Gagal membuat pengguna",
					data: null,
				};
			}
			return { success: true, message: "Pengguna berhasil dibuat", data: res };
		} catch {
			return { success: false, message: "Terjadi kesalahan", data: null };
		}
	},
	login: async (body: LoginSchema) => {
		try {
			const res = await auth.api.signInEmail({
				body: { ...body },
			});
			if (res == null || !res.token) {
				return { success: false, message: "Password tidak valid", data: null };
			}
			return { success: true, message: "Login berhasil", data: res };
		} catch {
			return { success: false, message: "Password tidak valid", data: null };
		}
	},
	logout: async (headers: Headers) => {
		try {
			const res = await auth.api.signOut({ headers });
			if (res == null) {
				return { success: false, message: "Gagal logout", data: null };
			}
			return { success: true, message: "Logout berhasil", data: null };
		} catch {
			return { success: false, message: "Terjadi kesalahan", data: null };
		}
	},
	getCurrentUser: async (headers: Headers) => {
		try {
			const res = await auth.api.getSession({ headers });
			if (res == null) {
				return { success: false, message: "Gagal mendapatkan data pengguna" };
			}
			return {
				success: true,
				message: "Data pengguna berhasil diambil",
				data: res,
			};
		} catch {
			return { success: false, message: "Terjadi kesalahan" };
		}
	},
};

export default authRepository;
