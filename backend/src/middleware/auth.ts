import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import colors from "colors";
import User, { IUser } from "../models/User";

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export const handleInputErrors = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(401).json({ error: errors.array() });
		return;
	}

	next();
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const bearer = req.headers.authorization;

		if (!bearer.includes("Bearer")) {
			const error = new Error("No tienes acceso");
			res.status(402).json({ error: error.message });
			return;
		}

		const [, token] = bearer.split(" ");

		const userId = jwt.verify(token, process.env.JWT_SECRET);

		if (typeof userId === "object" && userId.id) {
			const user = await User.findById(userId.id);

			req.user = user;

            next();
		}
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			res.status(402).json("Firma invalida");
			return;
		}

		console.log(
			colors.red("Hubo un error en el servidor al autenticar el usuario")
		);
	}
};
