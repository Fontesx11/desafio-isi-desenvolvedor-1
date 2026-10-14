export function normalizeSpaces(value: string): string {
  const trimmedValue = value.replace(/^ +| +$/g, '');
  const normalizedValue = trimmedValue.replace(/ {2,}/g, ' ');

  return normalizedValue;
}
