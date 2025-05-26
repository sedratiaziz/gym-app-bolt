export function formatDate(date: Date, format: 'full' | 'short' = 'full'): string {
  if (!date) return '';

  const options: Intl.DateTimeFormatOptions = 
    format === 'full' 
      ? { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric' };

  return new Date(date).toLocaleDateString('en-US', options);
}

export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1);
  result.setDate(diff);
  return result;
}

export function getWeekEnd(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? 0 : 7);
  result.setDate(diff);
  return result;
}

export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}