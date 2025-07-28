import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";    




const app = express();
app.use(morgan("dev"));             
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://libray-management-system-frontend-1q59o1xn2.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// app.use("/api/books", BookRoutes);
// app.use(globalErrorHandler);
export { app };