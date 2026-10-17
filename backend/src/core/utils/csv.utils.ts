export function escapeCsvValue(value: string): string {
  if (value.includes(';') || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

export function formatCsvDecimal(value: string): string {
  return value.replace('.', ',');
}
