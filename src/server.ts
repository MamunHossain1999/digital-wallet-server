import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { app } from "./app";

dotenv.config();
console.log('Access Token Secret:', process.env.ACCESS_TOKEN_SECRET);
console.log('Refresh Token Secret:', process.env.REFRESH_TOKEN_SECRET);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
