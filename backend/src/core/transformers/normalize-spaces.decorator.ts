import { Transform } from 'class-transformer';
import { normalizeSpaces } from '../utils/string.utils.js';

export function NormalizeSpaces() {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? normalizeSpaces(value) : value,
  );
}
