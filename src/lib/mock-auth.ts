// Mock authentication module
// In production, replace with a real backend (API route + DB)

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "doctor";
  avatarInitials: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// Mock user database
const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: "u_001",
    name: "Dr. Yomna Hou",
    email: "admin@afya.tn",
    password: "Afya2026!",
    role: "admin",
    avatarInitials: "YH",
  },
  {
    id: "u_002",
    name: "Dr. Ahmed Ben Ali",
    email: "doctor@afya.tn",
    password: "Doctor123!",
    role: "doctor",
    avatarInitials: "AB",
  },
  {
    id: "u_003",
    name: "Utilisateur Test",
    email: "user@afya.tn",
    password: "User1234!",
    role: "user",
    avatarInitials: "UT",
  },
];

/**
 * Simulates an async login API call.
 * Replace this with a real fetch() to your backend in production.
 */
export async function mockLogin(email: string, password: string): Promise<LoginResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const match = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!match) {
    return {
      success: false,
      error: "invalid_credentials",
    };
  }

  const { password: _pw, ...user } = match;
  void _pw; // discard password from result

  return { success: true, user };
}

/**
 * Simulates session storage.
 * In production, use HTTP-only cookies / JWT via API route.
 */
export const SESSION_KEY = "afya_session";

export function saveSession(user: AuthUser) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
