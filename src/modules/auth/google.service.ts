import { OAuth2Client } from "google-auth-library";
import { User } from "../user/user.model";
import Wallet from "../wallet/wallet.model";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import bcrypt from "bcryptjs";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleLogin = async (credential: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error("Invalid Google token");

    console.log("Google payload:", payload);

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      const hashedPassword = await bcrypt.hash("random-google-password", 10);

      user = await User.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        password: hashedPassword,
        image: payload.picture,
        role: "user",
        refreshTokens: [],
      });

      // Create initial wallet for new Google user
      await Wallet.create({ 
        user: user._id, 
        balance: 50 
      });

      console.log("New Google user created:", user);
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
  } catch (error) {
    console.error("Google login service error:", error);
    throw error;
  }
};
