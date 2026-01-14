import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, defaultSession, sessionOptions } from "./session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.isLoggedIn) {
    session.email = defaultSession.email;
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}

export async function login(email: string, password: string): Promise<{ success: boolean; message: string }> {
  const validEmail = process.env.EMAIL;
  const validPassword = process.env.PASSWORD;

  if (email === validEmail && password === validPassword) {
    const session = await getSession();
    session.email = email;
    session.isLoggedIn = true;
    await session.save();

    return { success: true, message: "Login successful" };
  }

  return { success: false, message: "Invalid email or password" };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn;
}
