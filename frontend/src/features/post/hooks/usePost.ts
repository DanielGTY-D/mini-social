import { isAxiosError } from "axios";
import { API } from "../../../config/axios";
import type { FormPost } from "../components/createPost/CreatePost";
import { PostSchemaWithCursor } from "../schemas/Post.schema";
import type { PostArrayWithCursor } from "../models/Post.model";

const usePost = () => {
	const createPost = async (postContent: FormPost) => {
		try {
			const { data } = await API.post("/post/create", postContent);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const uplodaPostImage = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append("file", file);

			const { data } = await API.post("post/upload/image", formData);
			console.log(data)
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const getAllPostByUser = async (
		userid: string,
		cursor?: string
	): Promise<PostArrayWithCursor> => {
		try {
			const response = await API.get(
				`post/${userid}/get?limit=10${
					cursor ? `&cursor=${cursor}` : ""
				}`
			);
			const result = PostSchemaWithCursor.safeParse(response.data);

			if (result.success) {
				return result.data;
			}

			return {} as PostArrayWithCursor;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}

		return {} as PostArrayWithCursor;
	};

	const getAllPost = async (
		cursor?: string
	): Promise<PostArrayWithCursor> => {
		try {
			const response = await API.get(
				`post/get?limit=10${cursor ? `&cursor=${cursor}` : ""}`
			);
			const result = PostSchemaWithCursor.safeParse(response.data);

			if (result.success) {
				return result.data;
			}

			return {} as PostArrayWithCursor;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}

		return {} as PostArrayWithCursor;
	};

	const likePost = async (postId: string) => {
		try {
			const { data } = await API.post(`/post/like/${postId}`);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const unlikePost = async (postId: string) => {
		try {
			const { data } = await API.delete(`/post/unlike/${postId}`);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	return {
		createPost,
		getAllPost,
		getAllPostByUser,
		likePost,
		unlikePost,
		uplodaPostImage
	};
};

export default usePost;
