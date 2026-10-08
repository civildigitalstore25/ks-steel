import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  role: "superadmin" | "admin";
  createdAt: Date;
  updatedAt: Date;
  mustChangePassword?: boolean;
}

export interface UserDTO {
  id: string;
  email: string;
  role: string;
}
