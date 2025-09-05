export type UserRole = 'admin' | 'user' | 'agent';
export type UserStatus = 'active' | 'blocked';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  commissionRate?: number;
  isApproved?: boolean;
  image?: string;
  refreshTokens: string[]; // DB তে store হয়
  agentId?: string;
}

// Login বা register response type
export interface AuthResponse {
  user: IUser;          // user info
  accessToken: string;  // login-এ client-এ পাঠানো
  refreshToken: string; // cookie বা response-এ
}
