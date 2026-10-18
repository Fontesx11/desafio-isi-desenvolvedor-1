import { Transform } from 'class-transformer';

const POSITIVE_INTEGER_PATTERN = /^[1-9][0-9]*$/;

export function ToPositiveInteger() {
  return Transform(({ value }: { value: unknown }) => (typeof value === 'string' && POSITIVE_INTEGER_PATTERN.test(value) ? Number(value) : value));
}
