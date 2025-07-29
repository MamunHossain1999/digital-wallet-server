import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Wallet from "../wallet/wallet.model";
import { User } from "../user/user.model";


const refreshTokens: string[] = [];

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "agent" | "admin";
}

export const registerUser = async ({
  name,
  email,
  password,
  role = "user",
}: RegisterInput) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await Wallet.create({ user: user._id, balance: 50 });

  const payload = { userId: user._id.toString(), role: user.role };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

  // Optional: add the refresh token to the list (like in loginUser)
  refreshTokens.push(refreshToken);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};


export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload = { userId: user._id.toString(), role: user.role };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

  refreshTokens.push(refreshToken);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  const index = refreshTokens.indexOf(refreshToken);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  } else {
    throw new Error("Invalid refresh token");
  }
};
