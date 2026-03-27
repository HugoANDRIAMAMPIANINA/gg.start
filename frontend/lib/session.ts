"server-only";

import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

export async function getAuthTokenHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = [
    accessToken ? `accessToken=${accessToken}` : null,
    refreshToken ? `refreshToken=${refreshToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return cookieHeader ? { Cookie: cookieHeader } : {};
}

export async function setSessionTokens(setCookieHeader: string[]) {
  const cookieStore = await cookies();

  const parsedCookies = setCookieParser.parse(setCookieHeader);

  parsedCookies.forEach((cookie) => {
    cookieStore.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite as "lax" | "strict" | "none",
      path: cookie.path,
      maxAge: cookie.maxAge,
    });
  });
}

export async function deleteSessionTokens() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
