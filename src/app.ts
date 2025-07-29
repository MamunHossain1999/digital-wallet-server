import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";    
import { AuthRoutes } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { walletRoutes } from "./modules/wallet/wallet.routes";
import { AuthTransation } from "./modules/transaction/transaction.routes";





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
app.use("/api/auth", AuthRoutes);
app.use('/api/transation', AuthTransation);
app.use('/api/wallet', walletRoutes);
app.use(globalErrorHandler);
export { app };