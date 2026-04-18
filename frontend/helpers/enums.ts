import { BracketState } from "@/common/enums/bracket-state.enum";
import { BracketType } from "@/common/enums/bracket-type.enum";
import { MatchState } from "@/common/enums/match-state.enum";

export function displayBracketType(bracketType: BracketType) {
  if (bracketType === BracketType.SINGLE_ELIM) {
    return "Elimination Directe";
  } else if (bracketType === BracketType.DOUBLE_ELIM) {
    return "Double Elimination";
  } else {
    throw new Error("Unsupported BracketType");
  }
}

export function displayBracketState(bracketState: BracketState) {
  if (bracketState === BracketState.REGISTRATION) {
    return "Inscription";
  } else if (bracketState === BracketState.CHECK_IN) {
    return "Enregistrement";
  } else if (bracketState === BracketState.ONGOING) {
    return "En cours";
  } else if (bracketState === BracketState.COMPLETED) {
    return "Terminé";
  } else {
    throw new Error("Unsupported BracketState");
  }
}

export function displayMatchState(matchState: MatchState) {
  if (matchState === MatchState.PENDING) {
    return "En attente";
  } else if (matchState === MatchState.READY) {
    return "Prêt";
  } else if (matchState === MatchState.ONGOING) {
    return "En cours";
  } else if (matchState === MatchState.COMPLETED) {
    return "Terminé";
  } else {
    throw new Error("Unsupported MatchState");
  }
}
