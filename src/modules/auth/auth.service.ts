// auth.service.ts
import bcrypt from "bcryptjs";
import Wallet from "../wallet/wallet.model";
import { User } from "../user/user.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token";
import { Response } from "express";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "agent" | "admin";
}

// -------- Register User --------
export const registerUser = async ({
  name,
  email,
  password,
  role = "user",
}: RegisterInput) => {
  try {
    // only 1 admin allowed
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) throw new Error("Only one admin allowed.");
    }

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // initial wallet with 50 balance
    const wallet = await Wallet.create({ user: user._id, balance: 50 });
    if (!wallet) throw new Error("Failed to create initial wallet");

    // issue tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    return { user, accessToken, refreshToken };
  } catch (err) {
    console.error("registerUser service error:", err);
    throw err; // rethrow to controller
  }
};

// -------- Login User --------
export const loginUser = async (
  input: { email: string; password: string },
  res: Response
) => {
  const { email, password } = input;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // issue tokens
  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  // ✅ set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax", // localhost এ কাজ করবে
    secure: false,   // dev এর জন্য
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken
    },
  };
};
// -------- Logout User --------
export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("No refresh token found");

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (user) {
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
  }

  return { message: "Logged out successfully" };
};




// -------- Get User By ID --------
export const getUserById = async (id: string) => {
  return User.findById(id).select("-password");
};

