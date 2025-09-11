import { isAxiosError } from "axios";
import { API } from "../../../../config/axios";
import { UserSchema, UserSchemaArray } from "../schemas/user.schema";
import type {
	updatedUserInfo,
	User,
	UserArray,
	UserWithID,
} from "../models/user.model";

const useProfile = () => {
	const getUser = async () => {
		try {
			const { data } = await API.get("/user/get");
			const results = UserSchema.safeParse(data);

			if (results.success) {
				return results.data;
			}
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const getUserByID = async (userID: string) : Promise<User> => {
		try {
			const { data } = await API.get(`/user/get/${userID}`);
			const results = UserSchema.safeParse(data);

			if (results.success) {
				return results.data;
			}

			return {} as User
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}

		return {} as User
	};

	const uplodaProfilePhoto = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			const {data} = await API.post("/user/upload/image", formData);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	}

	const updateProfile = async (updateUser: updatedUserInfo) => {
		try {
			const { data } = await API.patch("/user/update", updateUser);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const getFollowers = async (): Promise<UserArray> => {
		try {
			const { data } = await API.get("/user/followers");
			const result = UserSchemaArray.safeParse(data);

			if (result.success) {
				return result.data;
			}

			return [];
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}

		return [];
	};

	const getFollowersByID = async (
		userID: UserWithID["_id"]
	): Promise<UserArray> => {
		try {
			const { data } = await API.get(`/user/${userID}/followers`);
			const result = UserSchemaArray.safeParse(data);

			if (result.success) {
				return result.data;
			}

			return [];
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
		return [];
	};

	const getFollowing = async (): Promise<UserArray> => {
		try {
			const { data } = await API.get("/user/following");
			const result = UserSchemaArray.safeParse(data);

			if (result.success) {
				return result.data;
			}

			// If parsing fails, return an empty array to satisfy the return type
			return [];
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
			// On error, also return an empty array
			return [];
		}
	};

	const getFollowingByID = async (userID: UserWithID["_id"]) => {
		try {
			const { data } = await API.get(`/user/${userID}/following`);
			const result = UserSchemaArray.safeParse(data);

			if (result.success) {
				return result.data;
			}

			// If parsing fails, return an empty array to satisfy the return type
			return [];
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
		return [];
	};

	const followUser = async (userID: UserWithID["_id"]) => {
		try {
			const { data } = await API.post(`/user/${userID}/follow`);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const unfollowUser = async (userID: UserWithID["_id"]) => {
		try {
			const { data } = await API.delete(`/user/${userID}/unfollow`);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	return {
		getUser,
		getUserByID,
		updateProfile,
		getFollowers,
		getFollowersByID,
		getFollowing,
		getFollowingByID,
		followUser,
		unfollowUser,
		uplodaProfilePhoto
	};
};

export default useProfile;
