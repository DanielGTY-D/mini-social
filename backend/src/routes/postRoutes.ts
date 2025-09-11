import { Router } from "express";
import { authenticate, handleInputErrors } from "../middleware/auth";
import {
	createPost,
	deletePostByID,
	getAllPost,
	getPostByID,
	getUserPosts,
	likePost,
	unlikePost,
	updatePostByID,
	uploadImagePost,
} from "../controllers/postController";
import { body } from "express-validator";

const router = Router();

router.post(
	"/create",
	authenticate,
	body("content")
		.notEmpty()
		.withMessage("Este campo no puede ir vacio")
		.isString()
		.withMessage("Texto no valido"),
	body("image")
		.optional()
		.notEmpty()
		.withMessage("Este campo no puede ir vacio")
		.isString()
		.withMessage("URL de la imagen no valda"),
	handleInputErrors,
	createPost
);

router.post("/upload/image", authenticate, uploadImagePost)

router.get("/get", getAllPost);

router.get("/get/:id", getPostByID);

// obtener los post de un usuario
router.get("/:userid/get", getUserPosts)

router.delete("/delete/:id", authenticate, deletePostByID);

router.patch(
	"/update/:id",
	body("content")
        .optional()
		.notEmpty()
		.withMessage("Este campo no puede ir vacio")
		.isString()
		.withMessage("Texto no valido"),
	body("image")
		.optional()
		.notEmpty()
		.withMessage("Este campo no puede ir vacio")
		.isString()
		.withMessage("URL de la imagen no valda"),
	handleInputErrors,
	authenticate,
	updatePostByID
);

router.post("/like/:id", authenticate, likePost);

router.delete("/unlike/:id", authenticate, unlikePost);
export default router;
