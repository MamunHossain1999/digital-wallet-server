import bcrypt from "bcryptjs";
import Wallet from "../wallet/wallet.model";
import { User } from "../user/user.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

const refreshTokens: string[] = [];

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "agent" | "admin";
}


// register user
export const registerUser = async ({
  name,
  email,
  password,
  role = "user",
}: RegisterInput) => {
// akjoner besi admin hote parbe na
  if (role === "admin") {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) throw new Error("Only one admin allowed.");
  }

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

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  refreshTokens.push(refreshToken);

  return { user, accessToken, refreshToken };
};



// login user
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

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

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

// logout 
export const logoutUser = async (refreshToken: string) => {
  const index = refreshTokens.indexOf(refreshToken);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  } else {
    throw new Error("Invalid refresh token");
  }
};
