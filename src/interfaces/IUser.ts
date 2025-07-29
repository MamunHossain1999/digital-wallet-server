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
}
