import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/shared/lib/env";
import { HttpError } from "@/shared/lib/api-response";

export const AUTH_COOKIE = "namkeen_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AuthPayload {
  sub: string;
  email: string;
  role: "admin";
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.jwtSecret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || payload.role !== "admin") return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      role: "admin",
    };
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });
}

export async function clearAuthCookie(): Promise<void> {
  (await cookies()).set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Reads the current admin session from the request cookie, or null. */
export async function getSession(): Promise<AuthPayload | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Throws a 401 HttpError when no valid admin session is present. */
export async function requireAdmin(): Promise<AuthPayload> {
  const session = await getSession();
  if (!session) {
    throw new HttpError("Unauthorized", 401);
  }
  return session;
}
