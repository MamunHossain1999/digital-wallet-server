// auth.controller.ts
import { Request, Response, RequestHandler } from "express";
import * as authService from "./auth.service";
import { ZodError } from "zod";
import { loginSchema, registerSchema } from "./auth.validation";
import { User } from "../user/user.model";
import Wallet from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";

// -------- Register --------
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

// -------- Login --------
export const login = async (req: Request, res: Response) => {
  try {
    loginSchema.parse(req.body);

    const data = await authService.loginUser(req.body, res);

    res.status(200).json({
      message: "Login successful",
      user: data.user,
    });
  } catch (err) {
    if (err instanceof ZodError)
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.issues });

    res
      .status(401)
      .json({ message: "Login failed", error: (err as Error).message });
  }
};

// -------- Logout --------
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    
    // Even if no token found, still clear cookies for complete logout
    if (token) {
      await authService.logoutUser(token); // শুধু DB কাজ করবে
    }

    // ✅ cookies clear এখানে করবেন (controller এ) - Always clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    // Even if error occurs, still clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    
    res
      .status(200) // Changed to 200 since cookies are cleared
      .json({ message: "Logged out successfully", note: "Cookies cleared despite error" });
  }
};


// -------- Me --------
export const getMe: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};


// agnet profile controller
export const getAgentProfile: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(userId).select("-password");
  if (!user || user.role !== "agent") {
    return res.status(404).json({ message: "Agent not found" });
  }

  // Wallet balance
  const wallet = await Wallet.findOne({ user: userId });
  const walletBalance = wallet?.balance || 0;

  // Total customers (user collection থেকে count)
  const totalCustomers = await User.countDocuments({ agentId: userId });

  // Transactions count
  const transactions = await Transaction.countDocuments({ agent: userId });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || "active",
    walletBalance,
    totalCustomers,
    transactions,
  });
};



