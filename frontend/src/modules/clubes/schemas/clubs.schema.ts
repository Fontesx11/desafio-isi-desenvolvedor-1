import { z } from 'zod';
import { FORMATION_VALUES } from '../constants/clubs.constants';

const NAME_MESSAGE = 'Use de 3 a 60 caracteres.';

export const createClubSchema = z.object({
  name: z.string().trim().min(3, NAME_MESSAGE).max(60, NAME_MESSAGE),
  acronym: z.string().regex(/^[A-Z]{3}$/, 'Use 3 letras de A a Z, maiúsculas.'),
});

export type CreateClubValues = z.infer<typeof createClubSchema>;

export const lineupSchema = z.object({
  formation: z.enum(FORMATION_VALUES, { error: 'Escolha a formação.' }),
  player_ids: z.array(z.string().min(1, 'Escolha o titular.')),
});

export type LineupValues = z.infer<typeof lineupSchema>;
