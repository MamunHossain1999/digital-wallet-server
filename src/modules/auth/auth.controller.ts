import { Request, Response } from 'express';
import * as authService from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';
import { ZodError } from 'zod';


// register
export const register = async (req: Request, res: Response) => {
  try {
    registerSchema.parse(req.body);
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.issues.map(e => ({ field: e.path[0], message: e.message })),
      });
    }
    res.status(400).json({ message: 'Registration failed', error: (err as Error).message });
  }
};


// login
export const login = async (req: Request, res: Response) => {
  try {
    loginSchema.parse(req.body);
    const data = await authService.loginUser(req.body);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.issues.map(e => ({ field: e.path[0], message: e.message })),
      });
    }
    res.status(401).json({ message: 'Login failed', error: (err as Error).message });
  }
};


// logout
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await authService.logoutUser(refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: (err as Error).message });
  }
};
