export function roundDivision(numerator: number, denominator: number): number {
  return Math.floor(numerator / denominator + 0.5);
}

export function pointsInRange(overall: number, from: number, to: number): number {
  return Math.max(0, Math.min(overall, to) - from + 1);
}
