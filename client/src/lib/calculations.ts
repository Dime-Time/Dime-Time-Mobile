export function calculateRoundUp(amount: number, multiplier: number = 1.0): number {
  const roundedAmount = Math.ceil(amount);
  const baseRoundUp = roundedAmount - amount;
  return parseFloat((baseRoundUp * multiplier).toFixed(2));
}

export function splitRoundUp(totalRoundUp: number, cryptoPercentage: number): { cryptoAmount: number; debtAmount: number } {
  const cryptoAmount = parseFloat((totalRoundUp * (cryptoPercentage / 100)).toFixed(2));
  const debtAmount = parseFloat((totalRoundUp - cryptoAmount).toFixed(2));
  return { cryptoAmount, debtAmount };
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function calculateDebtProgress(originalBalance: string, currentBalance: string): number {
  const original = parseFloat(originalBalance);
  const current = parseFloat(currentBalance);
  if (original === 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function estimatePayoffMonths(currentBalance: string, monthlyPayment: number): number {
  const balance = parseFloat(currentBalance);
  if (monthlyPayment <= 0) return 0;
  return Math.ceil(balance / monthlyPayment);
}
