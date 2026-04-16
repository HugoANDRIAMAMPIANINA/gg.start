"use server";

import apiClient from "@/lib/apiClient";
import { getAuthTokenHeaders, setSessionTokens } from "@/lib/session";
import { redirect } from "next/navigation";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export async function fetchWithAuth(
  config: AxiosRequestConfig,
  options: { redirectOnAuthFailure?: boolean } = {
    redirectOnAuthFailure: true,
  },
): Promise<AxiosResponse> {
  const headers = await getAuthTokenHeaders();

  try {
    return await apiClient({
      ...config,
      headers: { ...config.headers, ...headers },
    });
  } catch (error: any) {
    // Not a 401 — rethrow as is
    if (error.response?.status !== 401) {
      throw error;
    }

    // 401 — attempt refresh
    try {
      const refreshHeaders = await getAuthTokenHeaders();
      const refreshResponse = await apiClient.post("/auth/refresh", null, {
        headers: refreshHeaders,
      });

      const setCookieHeader = refreshResponse.headers["set-cookie"];
      if (setCookieHeader) {
        await setSessionTokens(setCookieHeader);
      }

      // Retry original request with fresh cookies
      const newHeaders = await getAuthTokenHeaders();
      return await apiClient({
        ...config,
        headers: { ...config.headers, ...newHeaders },
      });
    } catch {
      if (options.redirectOnAuthFailure) {
        redirect("/auth/login");
      }
      throw new Error("Auth failed");
    }
  }
}
