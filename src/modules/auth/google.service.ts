import { OAuth2Client } from "google-auth-library";
import { User } from "../user/user.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleLogin = async (credential: string) => {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw new Error("Invalid Google token");

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const hashedPassword = await bcrypt.hash("random-google-password", 10);

    user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      image: payload.picture,
      provider: "google",
      role: "user",
      refreshTokens: [],
    });
  }

  const tokenPayload = { userId: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token in DB (avoid duplicates)
  if (!user.refreshTokens.includes(refreshToken)) {
    user.refreshTokens.push(refreshToken);
    await user.save();
  }

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
    accessToken,
    refreshToken,
  };
};
