import colors from "colors";
import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI);
    const url2 = `${connection.connection.host}:${connection.connection.port}`;

    console.log(colors.green(`MongoDB connected at ${url2}`));
  } catch (error) {
    console.error(
      colors.red(`Error connecting to MongoDB:", ${error.message}`),
    );
    process.exit(1);
  }
};
