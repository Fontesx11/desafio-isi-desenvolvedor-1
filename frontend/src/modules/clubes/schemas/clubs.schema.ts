import { z } from 'zod';

const NAME_MESSAGE = 'Use de 3 a 60 caracteres.';

export const createClubSchema = z.object({
  name: z.string().trim().min(3, NAME_MESSAGE).max(60, NAME_MESSAGE),
  acronym: z.string().regex(/^[A-Z]{3}$/, 'Use 3 letras de A a Z, maiúsculas.'),
});

export type CreateClubValues = z.infer<typeof createClubSchema>;
