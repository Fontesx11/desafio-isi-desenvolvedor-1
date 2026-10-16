const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const signedCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
});

// Moeda com sinal: 35.7 → "+35,70"; -38.85 → "-38,85"; 0 → "0,00"
export function formatSignedCurrency(value: number) {
  return signedCurrencyFormatter.format(value);
}

const integerFormatter = new Intl.NumberFormat('pt-BR');

// Inteiro com separador de milhar: 1089 → "1.089"
export function formatInteger(value: number) {
  return integerFormatter.format(value);
}

const signedIntegerFormatter = new Intl.NumberFormat('pt-BR', {
  signDisplay: 'exceptZero',
});

export function formatSignedInteger(value: number) {
  return signedIntegerFormatter.format(value);
}

// Datas sempre no horário de Brasília, qualquer que seja o fuso do navegador
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
});

// "2027-03-02T10:15:00-03:00" → "02/03/2027"
export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

// "2027-03-02T10:15:00-03:00" → "10:15"
export function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}
