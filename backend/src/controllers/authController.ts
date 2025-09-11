import type { Request, Response } from "express";
import colors from "colors";
import User from "../models/User";
import { randomUser } from "../utils/randomUser";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { verificationToken } from "../utils/verificationToken";
import { sendVerificationEmail } from "../services/nodemailer";
import { generateJWT } from "../utils/JWT";

export const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		const newUser = new User(req.body);

		if (user) {
			const error = new Error("Este usuario ya esta registrado");
			res.status(401).json({ error: error.message });
			return;
		}

		// generar el usuario random
		newUser.username = randomUser();

		// hashear el password
		newUser.password = await hashPassword(password);

		// token de verificacion de email
		const token = verificationToken();

		newUser.verificationToken = token;

		// mandar el email con el token
		await sendVerificationEmail(email, token);

		// guardar el usuario en BD
		await newUser.save();

		res.json(
			"Cuenta creada correctamente, revisa tu email para verificar tu cuenta"
		);
	} catch (error) {
		console.log(error);
		// console.log(colors.red("Error del servidor"));
	}
};
export const verifyAccount = async (req: Request, res: Response) => {
	const { token } = req.params;
	try {
		const user = await User.findOne({ verificationToken: token });

		if (!user) {
			const error = new Error("Token no valido");
			res.status(401).json({ error: error.message });
			return;
		}

		user.emailVerified = true;
		user.verificationToken = "";

		await user.save();

		res.json("Usuario verificado correctamente");
	} catch (error) {
		console.log(colors.red("Error del servidor"));
	}
};
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		const isCorrectPassword = await comparePassword(
			password,
			user.password
		);

		if (!isCorrectPassword) {
			const error = new Error("El password es incorrecto");
			res.status(401).json({ error: error.message });
			return;
		}

		if (!user.emailVerified) {
			const error = new Error(
				"Es necesario verificar la cuenta par inciar sesion"
			);
			res.status(402).json({ error: error.message });
			return;
		}

		const token = generateJWT(user.id);

		res.json(token);
	} catch (error) {
		console.log(colors.red("Error del servidor"));
	}
};
export const forgotPassword = async (req: Request, res: Response) => {
	const { email, new_password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		user.password = await hashPassword(new_password);

		await user.save();

		res.json("Password actualizado correctamente");
	} catch (error) {
		console.log(colors.red("Error del servidor"));
	}
};
export const resetPassword = async (req: Request, res: Response) => {
	try {
		const { password } = req.body;
		const { id } = req.user;
		const user = await User.findById(id);

		// resetear el password
		user.password = await hashPassword(password);

	    await user.save();

		res.json("Password actualizado correctamente");
	} catch (error) {
		console.log(colors.red("Error del servidor"));
	}
};

