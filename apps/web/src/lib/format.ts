export const formatCentavos = (centavos: number): string =>
  `₱${(centavos / 100).toLocaleString("en-PH", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;

export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const baseHour = hour === 0 ? 12 : hour;
  const h = hour > 12 ? hour - 12 : baseHour;
  return `${h}:00 ${period}`;
};

export const formatHourRange = (startHour: number, endHour: number): string =>
  `${formatHour(startHour)} – ${formatHour(endHour)}`;
