import type { Request, Response } from "express";
import User from "../models/User";
import Post, { IPost } from "../models/Post";
import { FilterQuery } from "mongoose";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";

export const createPost = async (req: Request, res: Response) => {
	try {
		const { content, image } = req.body;
		const user = await User.findById(req.user.id);
		const post = new Post(req.body);

		post.author = req.user.id;

		post.save();

		res.json("Posteado correctamente");
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const uploadImagePost = (req: Request, res: Response) => {
	try {
		const form = formidable({
			multiples: false,
		});

		form.parse(req, (err, fields, files) => {
			// console.log(files.file[0]);

			cloudinary.uploader.upload(files.file[0].filepath, async function (error, result) {
				if(error) {
					const error = new Error("Hubo un error al subir la image");
					res.status(500).json({error: error.message})
					return;
				}
				if(result) {
					res.json({pathUrl: result.secure_url});
				}
			})

		});
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const getAllPost = async (req: Request, res: Response) => {
	try {
		const limit = parseInt(req.query.limit as string) || 10; // cuantos post se van a pedir
		const cursor = req.query.cursor as string; // cual fue el ultimo post en pedirce, si no hay trae los primero 10 recientes

		let query: FilterQuery<IPost> = {};
		if (cursor) {
			query.createdAt = { $lt: new Date(cursor) };
		}

		// -1 en sort: descendente
		const posts = await Post.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1)
			.populate("author", "avatar username _id");

		const hasNextPage = posts.length > limit;
		if (hasNextPage) posts.pop();

		res.json({
			nextCursor: hasNextPage ? posts[posts.length - 1].createdAt : null,
			posts,
		});
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const getPostByID = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const post = await Post.findById(id);

		if (!post) {
			const error = new Error(
				"Este post no existe o fue eliminado por el autor"
			);
			res.status(404).json({ error: error.message });
			return;
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const getUserPosts = async (req: Request, res: Response) => {
	try {
		const { userid } = req.params;
		const user = await User.findById(userid);
		const limit = parseInt(req.query.limit as string) || 10; // cuantos post se van a pedir
		const cursor = req.query.cursor as string; // cual fue el ultimo post en pedirce, si no hay trae los primero 10 recientes

		if (!userid) {
			const error = new Error(
				"Este usuario no existe o ya fue eliminado"
			);
			res.status(404).json({ error: error.message });
			return;
		}

		let query: FilterQuery<IPost> = {};
		if (cursor) {
			query.createdAt = { $lt: new Date(cursor) };
		}

		query.author = userid;

		// -1 en sort: descendente
		const posts = await Post.find(query)
			.sort({ createdAt: -1 })
			.limit(limit + 1)
			.populate("author", "avatar username _id");

		const hasNextPage = posts.length > limit;
		if (hasNextPage) posts.pop();

		res.json({
			nextCursor: hasNextPage ? posts[posts.length - 1].createdAt : null,
			posts,
		});
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const deletePostByID = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const post = await Post.findById(id);
		const user = await User.findById(req.user.id);

		if (!post) {
			const error = new Error("Este post ya fue eliminado");
			res.status(404).json({ error: error.message });
			return;
		}

		if (post.author.toString() !== req.user.id) {
			const error = new Error(
				"No puedes modificar un post que no es tuyo"
			);
			res.status(403).json({ error: error.message });
			return;
		}

		await post.deleteOne();

		// res.json({post: post.author, userId: req.user.id})
		res.json("Post eliminado correctamente");
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const updatePostByID = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { content, image } = req.body;
		const post = await Post.findById(id);

		if (!post) {
			const error = new Error("Este post ya fue eliminado");
			res.status(404).json({ error: error.message });
			return;
		}

		post.content = content || post.content;
		post.image = image || post.image;

		post.save();

		res.json("Post actualizado correctamente");
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const likePost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findById(req.user.id);
		const post = await Post.findById(id);

		if (!post) {
			const error = new Error("Este post no existe o fue eliminado");
			res.status(404).json({ error: error.message });
			return;
		}

		if (post.likes.includes(req.user.id)) {
			const error = new Error("Ya diste like a este post");
			res.status(403).json({ error: error.message });
			return;
		}

		post.likes.push(user.id);

		post.save();

		res.json("Has dado me gusta");
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
export const unlikePost = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findById(req.user.id);
		const post = await Post.findById(id);

		if (!post) {
			const error = new Error("Este post no existe o fue eliminado");
			res.status(404).json({ error: error.message });
			return;
		}

		if (!post.likes.includes(req.user.id)) {
			const error = new Error("Ya deslikeaste este post");
			res.status(403).json({ error: error.message });
			return;
		}

		post.likes = post.likes.filter(
			(like) => like._id.toString() !== user._id.toString()
		);

		post.save();

		res.json("Unliked post");
	} catch (error) {
		res.status(500).json({ error: "Hubo un error en el servidor" });
	}
};
// export const createPost = (req: Request, res: Response) => {
//     try {

//     } catch (error) {
//         res.status(500).json({error: "Hubo un error en el servidor"})
//     }
// }
