export function formatNumber(value: number, unit?: string) {
  const text = value.toLocaleString("es-CL", { maximumFractionDigits: 2 });
  if (!unit) return text;
  if (unit === "$") return `$${text}`;
  if (unit === "%") return `${text}%`;
  return `${text} ${unit}`;
}
