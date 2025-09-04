import { Request, Response } from "express";
import { User } from "../user/user.model";


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "name email role status createdAt");
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};
