import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "admin" | "user" | "agent";
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const verifyToken = (roles: ("admin" | "user" | "agent")[] = []) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = req.cookies?.accessToken || (authHeader ? authHeader.split(" ")[1] : null);

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
         (req as any).user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "You don't have permission to access this resource" });
      }

      next();
    } catch {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
