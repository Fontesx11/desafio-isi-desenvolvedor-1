import { z } from 'zod';

export const newMatchSchema = z.object({
  homeClubId: z.string().min(1, 'Escolha o mandante.'),
  awayClubId: z.string().min(1, 'Escolha o visitante.'),
});

export type NewMatchValues = z.infer<typeof newMatchSchema>;
