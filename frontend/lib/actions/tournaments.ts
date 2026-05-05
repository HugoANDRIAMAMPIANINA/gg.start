"use server";

import { FormState } from "@/common/states/register-form.state";
import { redirect } from "next/navigation";
import { NewTournamentFormSchema } from "@/common/schemas/new-tournament.schema";
import { Tournament } from "@/common/interfaces/tournament.interface";
import { NewBracketFormSchema } from "@/common/schemas/new-bracket.schema";
import { Bracket } from "@/common/interfaces/bracket.interface";
import { fetchWithAuth } from "./api";

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

interface NewBracketFormResult {
  errors: NewBracketFormErrors;
}

export interface NewBracketFormErrors {
  name?: string[] | undefined;
  game?: string[] | undefined;
  bracketType?: string[] | undefined;
  startDate?: string[] | undefined;
  message?: string | undefined;
}

export async function createTournament(
  state: FormState,
  formData: FormData,
): Promise<NewTournamentFormResult> {
  const rawStartDate = formData.get("startDate") as string;
  const rawEndDate = formData.get("endDate") as string;

  const validatedFields = NewTournamentFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    startDate: new Date(rawStartDate).toISOString(),
    endDate: new Date(rawEndDate).toISOString(),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, startDate, endDate } = validatedFields.data;

  let tournamentId = "";
  try {
    const response = await fetchWithAuth({
      method: "POST",
      url: "/tournaments",
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    const tournament: Tournament = response.data;
    tournamentId = tournament.id;
  } catch (error: any) {
    return { errors: { message: error.message } };
  }

  redirect(`/tournaments/${tournamentId}`);
}

export async function createBracket(
  state: FormState,
  formData: FormData,
): Promise<NewBracketFormResult> {
  const rawStartDate = formData.get("startDate") as string;
  if (!rawStartDate) {
    return {
      errors: {
        startDate: ["Veuillez renseigner une date de début pour l'arbre"],
      },
    };
  }

  const validatedFields = NewBracketFormSchema.safeParse({
    name: formData.get("name"),
    game: formData.get("game"),
    bracketType: formData.get("bracketType"),
    startDate: new Date(rawStartDate).toISOString(),
    tournamentId: formData.get("tournamentId"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, game, bracketType, startDate, tournamentId } =
    validatedFields.data;

  let bracketId = "";
  try {
    const response = await fetchWithAuth({
      method: "POST",
      url: "/brackets",
      data: {
        name,
        game,
        bracketType,
        startDate,
        tournamentId,
      },
    });
    const bracket: Bracket = response.data;
    bracketId = bracket.id;
  } catch (error: any) {
    return { errors: { message: error.response.data.message } };
  }

  redirect(`/tournaments/${tournamentId}/brackets/${bracketId}`);
}
