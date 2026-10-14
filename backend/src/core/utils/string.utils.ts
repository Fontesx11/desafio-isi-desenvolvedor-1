export function normalizeSpaces(value: string): string {
  const trimmedValue = value.replace(/^ +| +$/g, '');
  const normalizedValue = trimmedValue.replace(/ {2,}/g, ' ');

  return normalizedValue;
}

export function normalizeForComparison(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '');
}

function compareCodePoints(left: string, right: string): number {
  const leftCodePoints = Array.from(left, (char) => char.codePointAt(0) ?? 0);
  const rightCodePoints = Array.from(right, (char) => char.codePointAt(0) ?? 0);
  const length = Math.min(leftCodePoints.length, rightCodePoints.length);

  for (let index = 0; index < length; index++) {
    const difference = leftCodePoints[index] - rightCodePoints[index];
    if (difference !== 0) return difference;
  }

  return leftCodePoints.length - rightCodePoints.length;
}

export function compareNames(left: string, right: string): number {
  return compareCodePoints(
    normalizeForComparison(left),
    normalizeForComparison(right),
  );
}
