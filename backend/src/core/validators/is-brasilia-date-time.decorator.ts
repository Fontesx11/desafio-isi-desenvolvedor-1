import { ValidateBy } from 'class-validator';
import { isBrasiliaDateTime } from '../utils/date.utils.js';

export function IsBrasiliaDateTime() {
  return ValidateBy({
    name: 'isBrasiliaDateTime',
    validator: {
      validate: (value: unknown) => typeof value === 'string' && isBrasiliaDateTime(value),
      defaultMessage: (args) => `${args?.property} deve ser uma data e hora no formato YYYY-MM-DDTHH:MM-03:00`,
    },
  });
}
