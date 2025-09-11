import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CD_KEY_NAME,
  api_key: process.env.CD_API_KEY,
  api_secret: process.env.CD_API_SECRET,
});

export default cloudinary;