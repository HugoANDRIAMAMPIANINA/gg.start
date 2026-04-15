"use server";

import { RegisterFormSchema } from "@/common/schemas/register.schema";
import { FormState } from "@/common/states/register-form.state";
import apiClient from "../apiClient";
import { LoginFormSchema } from "@/common/schemas/login.schema";
import { redirect } from "next/navigation";
import { SessionUser } from "@/common/interfaces/session-user.interface";
import {
  deleteSessionTokens,
  getAuthTokenHeaders,
  setSessionTokens,
} from "../session";
import axios from "axios";
import { fetchWithAuth } from "./api";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface RegisterFormResult {
  errors: RegisterFormErrors;
}

export interface RegisterFormErrors {
  name?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
  message?: string | undefined;
}

interface LoginFormResult {
  errors: LoginFormErrors;
}

export interface LoginFormErrors {
  email?: string[] | undefined;
  password?: string[] | undefined;
  message?: string | undefined;
}

export async function register(
  state: FormState,
  formData: FormData,
): Promise<RegisterFormResult> {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await apiClient.post("/users/", {
      name,
      email,
      password,
    });
  } catch (error: any) {
    return { errors: { message: error.message } };
  }

  redirect("/auth/login/");
}

export async function login(
  formData: FormData,
): Promise<LoginFormResult | undefined> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    const setCookieHeader = response.headers["set-cookie"];

    if (!setCookieHeader) {
      return {
        errors: {
          message:
            "Une erreur est survenue lors de la génération de la session",
        },
      };
    }

    await setSessionTokens(setCookieHeader);
  } catch (error: any) {
    return { errors: { message: "Adresse Mail ou mot de passe invalide" } };
  }
}

export async function logout() {
  const headers = await getAuthTokenHeaders();
  await apiClient.get("/auth/logout", { headers: headers });
  await deleteSessionTokens();
  redirect("/auth/login/");
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const response = await fetchWithAuth(
      {
        method: "GET",
        url: "/auth/me",
      },
      { redirectOnAuthFailure: false },
    );
    return response.data ?? null;
  } catch {
    return null;
  }
}
