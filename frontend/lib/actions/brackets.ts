"use server";

import { AxiosError } from "axios";
import { fetchWithAuth } from "./api";
import { BracketPlayer } from "@/common/interfaces/bracket-player.interface";

export async function registerUserToBracket(
  userId: string,
  bracketId: string,
): Promise<string | undefined> {
  try {
    await fetchWithAuth(
      {
        method: "POST",
        url: `/brackets/${bracketId}/players`,
        data: {
          userId: userId,
        },
      },
      { redirectOnAuthFailure: false },
    );
    // const bracketPlayer: BracketPlayer = response.data;
    // return bracketPlayer;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data?.message;
    }
  }
}
