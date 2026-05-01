import {
  addDays,
  format,
  isSaturday,
  isSunday,
  isToday,
  isTomorrow,
  nextSaturday,
} from "date-fns";
import { z } from "zod";
import { formatHour } from "./format";

const toDateStr = (d: Date) => format(d, "yyyy-MM-dd");
const todayStr = () => toDateStr(new Date());

export const amenityEnum = z.enum([
  "floodlights",
  "parking",
  "showers",
  "pro-shop",
]);
export type AmenitySlug = z.infer<typeof amenityEnum>;

export const searchParamsSchema = z.object({
  where: z.string().default("cebu-city"),
  date: z.string().default(""),
  time: z.string().default("any"),
  courtType: z.enum(["any", "indoor", "outdoor", "covered"]).default("any"),
  duration: z.coerce.number().default(60),
  priceMax: z.coerce.number().optional(),
  sort: z.enum(["best", "price", "earliest"]).default("best"),
  weekend: z.coerce.boolean().default(false),
  amenities: z
    .preprocess(
      (v) => (Array.isArray(v) ? v : v ? [v] : []),
      z.array(amenityEnum),
    )
    .optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export function getFilterCount(params: Pick<SearchParams, "priceMax" | "amenities">): number {
  return (params.priceMax != null ? 1 : 0) + (params.amenities?.length ?? 0);
}

export function getDefaults(): SearchParams {
  return {
    where: "cebu-city",
    date: todayStr(),
    time: "any",
    courtType: "any",
    duration: 60,
    sort: "best",
    weekend: false,
  };
}

export function resolveDate(params: SearchParams): string {
  return params.date || todayStr();
}

/** Returns [saturday, sunday] date strings for the upcoming weekend */
export function getWeekendDates(): [string, string] {
  const now = new Date();
  const sat = isSaturday(now) ? now : isSunday(now) ? addDays(now, -1) : nextSaturday(now);
  const sun = addDays(sat, 1);
  return [toDateStr(sat), toDateStr(sun)];
}

export function applyQuickPick(
  current: SearchParams,
  pick: string,
): SearchParams {
  const now = new Date();

  const isWeekend = isSaturday(now) || isSunday(now);

  switch (pick) {
    case "Tonight":
      return {
        ...current,
        date: todayStr(),
        time: "18:00",
        // Tonight on a weekday is incompatible with weekend filter
        ...(isWeekend ? {} : { weekend: false }),
      };
    case "Tomorrow":
      return { ...current, date: toDateStr(addDays(now, 1)), time: "any" };
    case "Weekend":
      return {
        ...current,
        weekend: true,
        time: "any",
        // On a weekday, clear tonight's specific date since weekend overrides it
        ...(isWeekend ? {} : { date: "" }),
      };
    case "Indoor":
      return { ...current, courtType: "indoor" };
    case "Under ₱400":
      return { ...current, priceMax: 400 };
    default:
      return current;
  }
}

export function isQuickPickActive(params: SearchParams, label: string): boolean {
  switch (label) {
    case "Tonight":
      return params.date === todayStr() && params.time === "18:00";
    case "Tomorrow":
      return params.date === toDateStr(addDays(new Date(), 1));
    case "Weekend":
      return params.weekend === true;
    case "Indoor":
      return params.courtType === "indoor";
    case "Under ₱400":
      return params.priceMax === 400;
    default:
      return false;
  }
}

export function removeQuickPick(params: SearchParams, label: string): SearchParams {
  switch (label) {
    case "Tonight":
    case "Tomorrow":
    case "Weekend":
      return { ...params, weekend: false, date: todayStr(), time: "any" };
    case "Indoor":
      return { ...params, courtType: "any" };
    case "Under ₱400": {
      const { priceMax: _, ...rest } = params;
      return searchParamsSchema.parse(rest);
    }
    default:
      return params;
  }
}

export function areaSlugToName(slug: string): string {
  const map: Record<string, string> = {
    "cebu-city": "Cebu City",
    lahug: "Lahug",
    "it-park": "IT Park",
    banilad: "Banilad",
    talamban: "Talamban",
    mandaue: "Mandaue",
    mactan: "Mactan",
    talisay: "Talisay",
    srp: "SRP",
  };
  return map[slug] ?? slug;
}

export function formatTimeLabel(time: string): string {
  if (time === "any") return "Any time";
  const hour = Number(time.split(":")[0]);
  return formatHour(hour);
}

export function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEE, MMM d");
}
