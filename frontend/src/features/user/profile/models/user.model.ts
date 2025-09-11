import { z } from "zod";
import { UserSchema, UserSchemaArray } from "../schemas/user.schema";

export type User = z.infer<typeof UserSchema>;
export type UserArray = z.infer<typeof UserSchemaArray>;

export type UserWithID = User & {
	_id: string;
};

export type updatedUserInfo = {
	avatar: string;
	username: string;
	bio: string;
};
