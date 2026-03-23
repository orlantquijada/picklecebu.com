import { z } from "zod";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const searchParamsSchema = z.object({
  where: z.string().default("cebu-city"),
  date: z.string().default(""),
  time: z.string().default("any"),
  courtType: z.enum(["any", "indoor", "outdoor", "covered"]).default("any"),
  duration: z.coerce.number().default(60),
  priceMax: z.coerce.number().optional(),
  sort: z.enum(["best", "price", "earliest"]).default("best"),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export function getDefaults(): SearchParams {
  return {
    where: "cebu-city",
    date: today(),
    time: "any",
    courtType: "any",
    duration: 60,
    sort: "best",
  };
}

export function resolveDate(params: SearchParams): string {
  return params.date || today();
}

export function applyQuickPick(
  current: SearchParams,
  pick: string,
): SearchParams {
  const now = new Date();
  const todayStr = today();

  switch (pick) {
    case "Tonight":
      return { ...current, date: todayStr, time: "18:00" };
    case "Tomorrow": {
      const tom = new Date(now);
      tom.setDate(tom.getDate() + 1);
      const d = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, "0")}-${String(tom.getDate()).padStart(2, "0")}`;
      return { ...current, date: d, time: "any" };
    }
    case "Weekend": {
      const day = now.getDay(); // 0=Sun
      const daysUntilSat = day === 6 ? 0 : day === 0 ? 0 : 6 - day;
      const sat = new Date(now);
      sat.setDate(sat.getDate() + daysUntilSat);
      const d = `${sat.getFullYear()}-${String(sat.getMonth() + 1).padStart(2, "0")}-${String(sat.getDate()).padStart(2, "0")}`;
      return { ...current, date: d, time: "any" };
    }
    case "Indoor":
      return { ...current, courtType: "indoor" };
    case "Under ₱400":
      return { ...current, priceMax: 400 };
    default:
      return current;
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
  const [h] = time.split(":");
  const hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}:00 ${period}`;
}

export function formatDateLabel(dateStr: string): string {
  const todayStr = today();
  if (dateStr === todayStr) return "Today";
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  const tomStr = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, "0")}-${String(tom.getDate()).padStart(2, "0")}`;
  if (dateStr === tomStr) return "Tomorrow";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });
}
