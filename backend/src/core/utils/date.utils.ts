const BRASILIA_OFFSET_MS = 3 * 60 * 60 * 1000;
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function formatBrasiliaDateTime(date: Date): string {
  const brasiliaTime = new Date(date.getTime() - BRASILIA_OFFSET_MS);

  return `${brasiliaTime.toISOString().slice(0, 19)}-03:00`;
}

export function isBrasiliaDateTime(value: string): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const valueWithSeconds = value.replace('-03:00', ':00-03:00');

  return formatBrasiliaDateTime(date) === valueWithSeconds;
}

export function calculateRemainingDays(until: Date, now: Date): number {
  const remainingMs = until.getTime() - now.getTime();
  if (remainingMs <= 0) return 0;

  return Math.ceil(remainingMs / MS_PER_DAY);
}
