import {z} from 'zod'
import type { PostSchema, PostSchemaArray, PostSchemaWithCursor } from '../schemas/post.schema'

export type Post = z.infer< typeof PostSchema >;
export type PostArray = z.infer< typeof PostSchemaArray >;
export type PostArrayWithCursor = z.infer< typeof PostSchemaWithCursor >;