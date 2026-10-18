import { ValidateBy } from 'class-validator';

export function CrossFieldRule<T extends object>(isValid: (object: T) => boolean, message: string) {
  return ValidateBy({
    name: 'crossFieldRule',
    validator: {
      validate: (_value, args) => isValid(args?.object as T),
      defaultMessage: () => message,
    },
  });
}
