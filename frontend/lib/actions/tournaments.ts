"use server";

import { FormState } from "@/common/states/register-form.state";
import { redirect } from "next/navigation";
import apiClient from "../apiClient";
import { NewTournamentFormSchema } from "@/common/schemas/new-tournament.schema";

interface NewTournamentFormResult {
  errors: NewTournamentFormErrors;
}

export interface NewTournamentFormErrors {
  name?: string[] | undefined;
  description?: string[] | undefined;
  startDate?: string[] | undefined;
  endDate?: string[] | undefined;
  message?: string | undefined;
}

export async function createTournament(
  state: FormState,
  formData: FormData,
): Promise<NewTournamentFormResult> {
  // Validate form fields
  const validatedFields = NewTournamentFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, startDate, endDate } = validatedFields.data;

  try {
    await apiClient.post("/tournaments/", {
      name,
      description,
      startDate,
      endDate,
    });
  } catch (error: any) {
    return { errors: { message: error.message } };
  }

  redirect("/tournaments/");
}
