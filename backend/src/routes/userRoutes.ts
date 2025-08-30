import { Router } from "express";
import { body } from "express-validator";
import { authenticate, handleInputErrors } from "../middleware/auth";
import { getFollowingByID } from "../controllers/userController";
import {
	getUser,
	getUserByID,
	deleteUser,
	updateUser,
	followUser,
	unfollowUser,
	getFollowers,
	getFollowersByID,
	getFollowing,
} from "../controllers/userController";

const router = Router();

// para el perfil del usuario logueado
router.get("/get", authenticate, getUser);
// para obtener el perfil de alguien mas
router.get("/get/:id", authenticate, getUserByID);

router.patch(
	"/update",
	authenticate,
	body("avatar")
		.optional()
		.isString()
		.withMessage("Este campo debe ser un string"),
	body("username")
		.optional()
		.isString()
		.withMessage("Este campo debe ser un string"),
	body("bio")
		.optional()
		.isString()
		.withMessage("Este campo debe ser un string")
		.isLength({ max: 100 })
		.withMessage("La biografia debe contener maximo 100 caracteres"),
	handleInputErrors,
	updateUser
);

router.delete("/delete", authenticate, deleteUser);

router.post("/:id/follow", authenticate, followUser);
router.delete("/:id/unfollow", authenticate, unfollowUser);

//  del usuario logueado
router.get("/followers", authenticate, getFollowers);
router.get("/following", authenticate, getFollowing);
//  de otro usuario
router.get("/:id/followers", authenticate, getFollowersByID);
router.get("/:id/following", authenticate, getFollowingByID);
export default router;
