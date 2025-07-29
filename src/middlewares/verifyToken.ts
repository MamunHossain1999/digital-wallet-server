import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: 'admin' | 'user' | 'agent';
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const verifyToken = (roles: ('admin' | 'user' | 'agent')[] = []) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: 'No token provided' });

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey') as JwtPayload;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access forbidden: insufficient role' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token', error });
    }
  };
};
