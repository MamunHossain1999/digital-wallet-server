import { NextFunction, Response } from "express";
import { verifyAccessToken } from "../utils/token";
import { RequestWithUser } from "./verifyToken";

export const authenticate = (req: RequestWithUser, res: Response, next: NextFunction) => {
  console.log("headers.cookie:", req.headers.cookie);
  console.log("req.cookies:", (req as any).cookies);

  // 1) cookie প্রাধান্য
  let token = req.cookies?.accessToken;

  // 2) fallback to Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) return res.status(401).json({ message: "No token provided" });

  const decoded = verifyAccessToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid token" });

  req.user = { userId: (decoded as any).userId, role: (decoded as any).role };
  next();
};
