const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return euro.format(amount);
}

export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}
