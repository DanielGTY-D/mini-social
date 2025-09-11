import mongoose, { Schema, model, Document } from "mongoose";

export interface IPost extends Document {
	author: mongoose.Types.ObjectId; // referencia al usuario que lo creo
	content: string;
	image?: string;
	likes: mongoose.Types.ObjectId[];
	createdAt: Date;
	updateAt: Date;
}

const PostSchema = new Schema<IPost>(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
			maxlength: 500, // puedes limitar el tamaño
		},
		image: {
			type: String,
			default: "",
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true } // agrega createdAt y updatedAt
);

const Post = model<IPost>("Post", PostSchema);
export default Post;