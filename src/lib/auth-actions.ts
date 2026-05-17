"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mockLogin, AuthUser } from "./mock-auth";

export const SESSION_COOKIE = "afya_session";

/** Cookie max-age: 7 days */
const MAX_AGE = 60 * 60 * 24 * 7;

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────

export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const result = await mockLogin(email, password);

  if (!result.success || !result.user) {
    return { success: false, error: "invalid_credentials" };
  }

  // Store user data in a server-side HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(result.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return { success: true, user: result.user };
}

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────────────────────

export async function logoutAction(locale: string = "fr") {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(`/${locale}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Read session (server-side only)
// ─────────────────────────────────────────────────────────────────────────────

export async function getServerSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
