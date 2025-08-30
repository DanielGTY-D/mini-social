import type { Request, Response } from "express";
import User from "../models/User";
import { ObjectId, Schema } from "mongoose";

export const getUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user._id).select(
			"-password -emailVerified -verificationToken"
		);
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const getUserByID = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id).select(
			"-password -emailVerified -verificationToken"
		);

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const updateUser = async (req: Request, res: Response) => {
	try {
		const { avatar, username, bio } = req.body;
		const user = await User.findById(req.user.id);
		const usernameExists = await User.findOne({ username });

		if (usernameExists) {
			const error = new Error(
				"Este nombre de usuario ya esta registrado"
			);
			res.status(402).json({ error: error.message });
			return;
		}
		user.username = username || user.username;
		user.avatar = avatar || user.avatar;
		user.bio = bio || user.bio;
		user.save();

		res.json("Perfil actualizado correctamente");
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		user.deleteOne();

		res.json("Cuenta eliminada correctamente");
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const followUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userToFollow = await User.findById(id);
		const user = await User.findById(req.user.id);

		if (!userToFollow) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		if (user.following.includes(userToFollow.id)) {
			const error = new Error("Ya sigues a este usuario");
			res.status(400).json({ error: error.message });
			return;
		}

		user.following.push(userToFollow.id);
		userToFollow.followers.push(user.id);

		user.save();
		userToFollow.save();

		res.json(`Siguendo a ${userToFollow.username}`);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const unfollowUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userToUnfollow = await User.findById(id);
		const user = await User.findById(req.user.id);

		if (!userToUnfollow) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		if (!user.following.includes(userToUnfollow.id)) {
			const error = new Error("Ya no sigues a este usuario");
			res.status(400).json({ error: error.message });
			return;
		}

		user.following = user.following.filter(
			(currentUser) =>
				currentUser._id.toString() !== userToUnfollow._id.toString()
		);
		userToUnfollow.followers = userToUnfollow.followers.filter(
			(currentUser) => currentUser._id.toString() !== user._id.toString()
		);

		// res.json({user, userToUnfollow});

		user.save();
		userToUnfollow.save();

		res.json(`Dejando de seguir a ${userToUnfollow}`);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const getFollowers = async (req: Request, res: Response) => {
	try {
		const user = (
			await User.findById(req.user.id).select(
				"-password -emailVerified -verificationToken"
			)
		).populate({
			path: "followers",
			select: "-password -emailVerified -verificationToken",
		});

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}

		res.json((await user).followers);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const getFollowersByID = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = (
			await User.findById(id).select(
				"-password -emailVerified -verificationToken"
			)
		).populate({
			path: "followers",
			select: "-password -emailVerified -verificationToken",
		});

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}
		console.log(req.user.id);
		res.json((await user).followers);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const getFollowing = async (req: Request, res: Response) => {
	try {
		const user = (
			await User.findById(req.user.id).select(
				"-password -emailVerified -verificationToken"
			)
		).populate({
			path: "following",
			select: "-password -emailVerified -verificationToken",
		});

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}
		res.json((await user).following);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
export const getFollowingByID = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = (
			await User.findById(id).select(
				"-password -emailVerified -verificationToken"
			)
		).populate({
			path: "following",
			select: "-password -emailVerified -verificationToken",
		});

		if (!user) {
			const error = new Error("Este usuario no existe");
			res.status(404).json({ error: error.message });
			return;
		}
		console.log(req.user.id);
		res.json((await user).following);
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error: "Error del servidor" });
	}
};
// export const getUser = async (req: Request, res: Response) => {

// }
// export const getUser = async (req: Request, res: Response) => {

// }
