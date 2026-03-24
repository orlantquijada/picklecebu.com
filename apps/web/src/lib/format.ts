import { format } from "date-fns";

const pesoFormat = new Intl.NumberFormat("en-PH", {
  currency: "PHP",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatCentavos(centavos: number): string {
  return pesoFormat.format(centavos / 100);
}

export function formatHour(hour: number): string {
  return format(new Date(2000, 0, 1, hour), "h:mm a");
}

export function formatHourRange(startHour: number, endHour: number): string {
  return `${formatHour(startHour)} – ${formatHour(endHour)}`;
}
