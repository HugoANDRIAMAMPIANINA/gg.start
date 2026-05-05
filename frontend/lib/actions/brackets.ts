"use server";

import { AxiosError } from "axios";
import { fetchWithAuth } from "./api";
import { BracketPlayer } from "@/common/interfaces/bracket-player.interface";
import { MatchScore } from "@/common/interfaces/match-score.interface";

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
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data?.message;
    }
  }
}

export async function updateMatchScore(
  matchId: string,
  matchScore: MatchScore[],
): Promise<string | undefined> {
  try {
    await fetchWithAuth(
      {
        method: "POST",
        url: `/matches/${matchId}/set-score`,
        data: {
          matchScore: matchScore,
        },
      },
      { redirectOnAuthFailure: false },
    );
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data?.message;
    }
  }
}

export async function setMatchOngoing(
  matchId: string,
): Promise<string | undefined> {
  try {
    await fetchWithAuth(
      {
        method: "POST",
        url: `/matches/${matchId}/start`,
      },
      { redirectOnAuthFailure: false },
    );
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return error.response?.data?.message;
    }
  }
}
