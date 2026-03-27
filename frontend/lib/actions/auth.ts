"use server";

import { RegisterFormSchema } from "@/common/schemas/register.schema";
import { FormState } from "@/common/states/register-form.state";
import { apiClient } from "../axios";
import { LoginFormSchema } from "@/common/schemas/login.schema";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSession } from "./session";
import { AxiosError } from "axios";
import { SessionUser } from "@/common/interfaces/session-user.interface";

export async function register(state: FormState, formData: FormData) {
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
    return { error: { message: error.message } };
  }

  redirect("/auth/login/");
}

export async function login(formData: FormData) {
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

    const accessToken: string = response.data.access_token;
    console.log(accessToken);
    await createSession(accessToken);
  } catch (error: any) {
    return { errors: { message: "Adresse Mail ou mot de passe invalide" } };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/auth/login/");
}

export async function getCurrentUser() {
  const accessToken = await getSession();
  if (!accessToken) return null;

  const response = await apiClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const currentUser: SessionUser = response.data;
  if (currentUser) {
    return currentUser;
  }
  return null;
}
