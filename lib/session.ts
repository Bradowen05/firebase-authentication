import { SessionOptions } from "iron-session";

export interface SessionData {
  email: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  email: "",
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long_for_security",
  cookieName: "basic-auth-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};
