import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    let conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB connected Successfully : ${conn.connection.host}`);
  } catch (error) {
    console.log("there was an error connecting :", error.message);
    process.exit();
  }
};
