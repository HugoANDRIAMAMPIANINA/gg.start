import * as z from "zod";

export const NewTournamentFormSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
});
