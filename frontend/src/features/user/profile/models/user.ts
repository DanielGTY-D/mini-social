import {z} from 'zod'
import { UserSchema } from '../schemas/user'

export type User = z.infer<typeof UserSchema>;

export type updatedUserInfo = {
    avatar: string,
    username: string,
    bio: string,
}