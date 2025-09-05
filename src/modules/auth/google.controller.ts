import { Request, Response } from "express";
import { handleGoogleLogin } from "./google.service";

interface GoogleLoginBody {
  token: string;
}

interface GoogleLoginResult {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const googleLogin = async (
  req: Request<{}, {}, GoogleLoginBody>,
  res: Response
) => {
  try {
    const { token } = req.body;

    // Token validation
    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Valid token is required" });
    }

    // Google login service
    const result: GoogleLoginResult = await handleGoogleLogin(token);

    // Set refresh token cookie - matching regular login settings
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token cookie - matching regular login settings
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Send response
    res.status(200).json(result);
  } catch (err: any) {
    console.error("Google login error:", err);
    res
      .status(401)
      .json({ message: "Google login failed", error: err.message });
  }
};
