import { z } from 'zod';
import { CONDITIONS, POSITIONS } from '../constants/players.constants';

function integerInRange(
  min: number,
  max: number,
  rangeMessage: string,
  requiredMessage: string,
) {
  return z
    .number({ error: requiredMessage })
    .int(rangeMessage)
    .min(min, rangeMessage)
    .max(max, rangeMessage);
}

const NAME_MESSAGE = 'Use de 3 a 100 caracteres.';
const nameField = z.string().trim().min(3, NAME_MESSAGE).max(100, NAME_MESSAGE);
const positionField = z.enum(POSITIONS, { error: 'Escolha a posição.' });
const agilityField = integerInRange(
  1,
  100,
  'Use um valor de 1 a 100.',
  'Informe a agilidade.',
);
const attributeField = integerInRange(
  1,
  99,
  'Use um valor de 1 a 99.',
  'Informe o valor.',
);

export const attributesSchema = z.object({
  pace: attributeField,
  shooting: attributeField,
  passing: attributeField,
  dribbling: attributeField,
  defending: attributeField,
  physical: attributeField,
  potential: integerInRange(
    1,
    99,
    'Use um valor de 1 a 99.',
    'Informe o potencial.',
  ),
});

export const createPlayerSchema = attributesSchema.extend({
  name: nameField,
  position: positionField,
  age: integerInRange(
    16,
    45,
    'Use uma idade de 16 a 45 anos.',
    'Informe a idade.',
  ),
  agility: agilityField,
});

export type CreatePlayerValues = z.infer<typeof createPlayerSchema>;

export function editPlayerSchema(currentAge: number) {
  return z.object({
    name: nameField,
    position: positionField,
    age: integerInRange(
      currentAge,
      45,
      `Use uma idade de ${currentAge} a 45 anos.`,
      'Informe a idade.',
    ),
    agility: agilityField,
  });
}

export type EditPlayerValues = z.infer<ReturnType<typeof editPlayerSchema>>;

export const changeConditionSchema = z.object({
  condition: z.enum(CONDITIONS, { error: 'Escolha a nova condição.' }),
});

export type ChangeConditionValues = z.infer<typeof changeConditionSchema>;

export const buyPlayerSchema = z.object({
  clubId: z.string().min(1, 'Escolha o clube comprador.'),
  loyaltyDate: z.string().min(1, 'Informe a data do fim da fidelidade.'),
  loyaltyTime: z.string().min(1, 'Informe a hora do fim da fidelidade.'),
});

export type BuyPlayerValues = z.infer<typeof buyPlayerSchema>;
