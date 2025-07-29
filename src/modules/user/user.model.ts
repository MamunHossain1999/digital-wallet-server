import { Schema, model, Document } from 'mongoose';
import { IUser } from '../../interfaces/IUser';

export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'agent'], required: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  commissionRate: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export const User = model<UserDocument>('User', userSchema);
