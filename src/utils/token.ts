import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in .env");
}

export const generateAccessToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || "1d") as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};
