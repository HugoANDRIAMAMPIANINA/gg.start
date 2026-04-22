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
  await fetchWithAuth({
    method: "POST",
    url: "/auth/logout",
    headers: headers,
  });
  await deleteSessionTokens();
  redirect("/auth/login/");
}

export interface UpdateProfileResult {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    message?: string;
  };
  message?: string;
  user?: {
    name?: string;
    email?: string;
  };
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
  } catch (error) {
    return null;
  }
}

export async function updateProfile(
  formData: FormData,
): Promise<UpdateProfileResult> {
  const name = formData.get("name")?.toString().trim() || undefined;
  const email = formData.get("email")?.toString().trim() || undefined;
  const passwordRaw = formData.get("password")?.toString();
  const confirmPasswordRaw = formData.get("confirmPassword")?.toString();

  const password = passwordRaw?.trim() || undefined;
  const confirmPassword = confirmPasswordRaw?.trim() || undefined;

  const errors: UpdateProfileResult["errors"] = {};

  if (name !== undefined && name.length > 0 && name.length < 2) {
    errors.name = ["Le nom doit contenir au moins 2 caractères."];
  }

  if (email !== undefined && email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = ["Adresse e-mail invalide."];
    }
  }

  const shouldUpdatePassword = Boolean(password);

  if (shouldUpdatePassword) {
    if (password && password.length < 6) {
      errors.password = [
        "Le mot de passe doit contenir au moins 6 caractères.",
      ];
    }
    if (password !== confirmPassword) {
      errors.password = ["Les mots de passe ne correspondent pas."];
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const updateData: Record<string, string> = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (shouldUpdatePassword && password) updateData.password = password;

  if (Object.keys(updateData).length === 0) {
    return { message: "Aucune modification détectée." };
  }

  try {
    const headers = await getAuthTokenHeaders();
    const response = await apiClient.patch("/auth/me", updateData, {
      headers,
    });

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      await setSessionTokens(
        Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader],
      );
    }

    return {
      message: "Profil mis à jour.",
      user: {
        name: response.data.name,
        email: response.data.email,
      },
    };
  } catch (error: any) {
    const axiosError = axios.isAxiosError(error) ? error : null;
    return {
      errors: {
        message:
          axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Impossible de mettre à jour le profil.",
      },
    };
  }
}
