"use server";

import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("session");
  if (!hasCookie) {
    return null;
  }
  return cookieStore.get("session")?.value;
}

export async function createSession(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", accessToken, {
    httpOnly: true, // JS cannot read it — prevents XSS theft
    secure: true, // HTTPS only in production
    sameSite: "lax", // CSRF protection
    path: "/",
    maxAge: 60 * 60 * 24, // match your JWT expiry
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has("session");
  if (hasCookie) {
    cookieStore.delete("session");
  }
}
