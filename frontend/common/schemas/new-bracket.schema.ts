import * as z from "zod";
import { BracketType } from "../enums/bracket-type.enum";

export const NewBracketFormSchema = z.object({
  name: z.string().trim(),
  game: z.string().trim(),
  bracketType: z.enum(BracketType),
  startDate: z.iso.datetime(),
  tournamentId: z.uuidv4(),
});
