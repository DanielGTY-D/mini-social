import { Router } from "express";
import { body } from "express-validator";
import {
	forgotPassword,
	login,
	register,
	resetPassword,
	verifyAccount,
} from "../controllers/authController";
import { authenticate, handleInputErrors } from "../middleware/auth";

const router = Router();

router.post(
	"/register",
	body("email").isEmail().withMessage("No es un email valido"),
	body("password")
		.notEmpty()
		.withMessage("Este campo es obligatorio")
		.isLength({ min: 6, max: 10 })
		.withMessage("El password debe ser de minimo 6 a maximo 10"),
	handleInputErrors,
	register
);

router.post("/verify/:token", verifyAccount);

router.post(
	"/login",
	body("email").isEmail().withMessage("No es un email valido"),
	body("password")
		.notEmpty()
		.withMessage("Este campo es obligatorio")
		.isLength({ min: 6, max: 10 })
		.withMessage("El password debe ser de minimo 6 a maximo 10 caracteres"),
	handleInputErrors,
	login
);

router.post(
	"/forgot-password",
	body("email").isEmail().withMessage("No es un email valido"),
	body("new_password")
		.notEmpty()
		.isLength({ min: 6, max: 10 })
		.withMessage("El password debe ser de minimo 6 a maximo 10 caracteres"),
	handleInputErrors,
	forgotPassword
);

router.post(
	"/reset-password",
	authenticate,
	body("password")
		.notEmpty()
		.withMessage("El password es obligatorio")
		.isLength({ min: 6, max: 10 })
		.withMessage(
			"El password debe contener minimo 6 a maximo 10 caracteres"
		),
	handleInputErrors,
	resetPassword
);

export default router;
