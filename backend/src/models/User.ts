import mongoose, {Schema, Model, model, Document} from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    avatar?: string,
    bio?: string,
    followers: mongoose.Types.ObjectId[],
    following: mongoose.Types.ObjectId[],
    emailVerified: boolean,
    verificationToken: string,
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ], 
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    emailVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: "",
        trim: true
    }
})

const User = model("User", UserSchema)
export default User
