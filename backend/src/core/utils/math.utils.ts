export function roundDivision(numerator: number, denominator: number): number {
  return Math.floor(numerator / denominator + 0.5);
}

export function pointsInRange(overall: number, from: number, to: number): number {
  return Math.max(0, Math.min(overall, to) - from + 1);
}

export function toCents(value: number | string): number {
  return Math.round(Number(value) * 100);
}

export function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}
