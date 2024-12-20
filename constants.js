// constants.js
import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV !== "development",
};

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);
