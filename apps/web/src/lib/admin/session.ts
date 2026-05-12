import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { canAccessSection, type AdminSection } from "./permissions";
import type { AdminSession, LoginResponse } from "./types";

const SESSION_COOKIE = "swcv_admin_session";

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.NEXT_SESSION_SECRET ??
    process.env.JWT_ACCESS_SECRET ??
    "swcv-dev-admin-session-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function readTokenExpiration(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { exp?: number };

    if (typeof parsed.exp !== "number") {
      return null;
    }

    return new Date(parsed.exp * 1000).toISOString();
  } catch {
    return null;
  }
}

function encodeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url"
  );

  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string) {
  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as AdminSession;
  } catch {
    return null;
  }
}

function isExpired(session: AdminSession) {
  if (!session.expiresAt) {
    return false;
  }

  return new Date(session.expiresAt).getTime() <= Date.now();
}

function buildCookieOptions(expiresAt: string | null) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expiresAt ? { expires: new Date(expiresAt) } : {})
  };
}

export async function setAdminSession(login: LoginResponse) {
  const expiresAt = readTokenExpiration(login.accessToken);
  const session: AdminSession = {
    accessToken: login.accessToken,
    expiresAt,
    user: login.user
  };

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    encodeSession(session),
    buildCookieOptions(expiresAt)
  );

  return session;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    ...buildCookieOptions(null),
    expires: new Date(0),
    maxAge: 0
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  const session = decodeSession(value);

  if (!session || isExpired(session)) {
    return null;
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login?error=Inicia%20sesion%20para%20continuar.");
  }

  return session;
}

export async function requireAdminSection(section: AdminSection) {
  const session = await requireAdminSession();

  if (!canAccessSection(session.user.role, section)) {
    redirect("/admin?error=No%20tienes%20acceso%20a%20ese%20modulo.");
  }

  return session;
}

export function buildLogoutUrl(message?: string) {
  const target = message
    ? `/admin/login?error=${encodeURIComponent(message)}`
    : "/admin/login";

  return `/admin/logout?from=${encodeURIComponent(target)}`;
}
