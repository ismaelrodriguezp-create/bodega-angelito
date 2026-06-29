export function formatCurrency(value: number, locale = 'es-CL', currency = 'CLP'): string {
  // Para CLP, normalmente no mostramos decimales
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'CLP' ? 0 : 2,
    maximumFractionDigits: currency === 'CLP' ? 0 : 2,
  };
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(dateString: string | Date, includeTime = true): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };
  return new Intl.DateTimeFormat('es-CL', options).format(date);
}

export function generateSKU(name: string, categoryName = 'GEN'): string {
  const prefix = categoryName.substring(0, 3).toUpperCase().padEnd(3, 'X');
  const cleanName = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 4)
    .toUpperCase()
    .padEnd(4, 'X');
  const uniqueNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${cleanName}-${uniqueNum}`;
}
