import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secretkey';
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsecretkey';

export const generateAccessToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: '1d' };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (payload: object): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
