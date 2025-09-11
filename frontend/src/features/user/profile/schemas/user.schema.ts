import {z} from 'zod';

export const UserSchema = z.object({
    avatar: z.string(),
    bio: z.string(),
    email: z.string(),
    followers: z.array(z.string()),
    following: z.array(z.string()),
    username: z.string(),
    _id: z.string().nullable()
})

export const UserSchemaArray = z.array(UserSchema)

export const UserForPost = UserSchema.pick({
    avatar: true,
    username: true,
    _id: true,
})