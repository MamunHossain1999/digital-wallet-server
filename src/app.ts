import path from "path";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { walletRoutes } from "./modules/wallet/wallet.routes";
import { adminRouter } from "./modules/auth/admin.route";
import { authRoute } from "./modules/auth/auth.route";
import { AuthTransaction } from "./modules/transaction/transaction.routes";

const app = express();
app.use(morgan("dev"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser (must be before routes so req.cookies is available)
app.use(cookieParser());

// CORS (allow credentials)
app.use(
  cors({
    origin: ["https://digital-wallet-client-mu.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ----- API routes -----
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRouter);
app.use("/api/transaction", AuthTransaction);
app.use("/api/wallet", walletRoutes);


// Global error handler (keep after routes / static)
app.use(globalErrorHandler);

export { app };
