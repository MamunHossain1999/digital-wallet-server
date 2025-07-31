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
      if (!authHeader) {
        console.log('No Authorization header found');
        return res.status(401).json({ message: 'No token provided' });
      }
      
      console.log('Authorization header:', authHeader);
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey') as JwtPayload;
      
      console.log('Decoded token:', decoded);
      
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        console.log('Access forbidden: insufficient role');
        return res.status(403).json({ message: 'Access forbidden: insufficient role' });
      }

      next();
    } catch (error) {
      console.log('JWT verify error:', error);
      res.status(401).json({ message: 'Invalid token', error });
    }
  };
};
