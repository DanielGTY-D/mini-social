import { z } from "zod";
import { UserForPost } from "../../user/profile/schemas/user.schema";

export const PostSchema = z.object({
	_id: z.string(),
	content: z.string(),
	image: z.string(),
	likes: z.array(z.string()),
	author: UserForPost,
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const PostSchemaArray = z.array(PostSchema);

export const PostSchemaWithCursor = z.object({
	nextCursor: z.string().nullable(),
	posts: PostSchemaArray,
});
