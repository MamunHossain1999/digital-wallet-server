import { Request } from "express";

export interface DecodedUser {
  userId: string;
  role: "admin" | "user" | "agent";
  name?: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}
