import {z} from 'zod';

export const UserSchema = z.object({
    avatar: z.string(),
    bio: z.string(),
    email: z.string(),
    followers: z.array(z.string()),
    following: z.array(z.string()),
    username: z.string()
})