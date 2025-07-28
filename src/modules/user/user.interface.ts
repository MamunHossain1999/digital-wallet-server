import { Types } from "mongoose";

export enum Role {
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE",

}

// auth providers
// email, password
// google authintication

export interface IAuthProvider {
    provider: string;  // 'google' , credential'
    providerId: string;
}


export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOBKED = "BLOCKED"
}

export interface IUser {
    name:string;
    email:string;
    password?: string;
    phone?: string;
    picture?: string;
    address?:string;
    isDeleted?: string;
    isActive?: isActive;
    isVerified?: string;
    role:Role;
    auths: IAuthProvider[]
    bookings?: Types.ObjectId[]
    guides?: Types.ObjectId[]
}