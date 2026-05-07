"use server";

import apiClient from "@/lib/apiClient";
import { getAuthTokenHeaders, setSessionTokens } from "@/lib/session";
import { redirect } from "next/navigation";
import { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

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
    // If not a 401, rethrow error without altering it
    if (error.response?.status !== 401) {
      throw error;
    }

    // If it is a 401, try to refresh the tokens
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
    } catch (error: any) {
      console.log(error);
      if (
        options.redirectOnAuthFailure &&
        error instanceof AxiosError &&
        error.response?.status === 401
      ) {
        redirect("/auth/login");
      }
      throw error;
    }
  }
}
