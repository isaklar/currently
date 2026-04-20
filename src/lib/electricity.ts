export interface HourlyPrice {
  SEK_per_kWh: number;
  EUR_per_kWh: number;
  EXR: number;
  time_start: string;
  time_end: string;
}

export interface ZoneData {
  zone: string;
  zoneName: string;
  prices: HourlyPrice[];
  currentPrice: number | null;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  error?: string;
}

export const ZONES = [
  { id: "SE1", name: "Luleå / Norra Sverige" },
  { id: "SE2", name: "Sundsvall / Norra Mellansverige" },
  { id: "SE3", name: "Stockholm / Södra Mellansverige" },
  { id: "SE4", name: "Malmö / Södra Sverige" },
];

export async function fetchZonePrice(zone: string, date: Date): Promise<HourlyPrice[]> {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const url = `https://www.elprisetjustnu.se/api/v1/prices/${year}/${month}-${day}_${zone}.json`;

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch prices for ${zone}: ${response.statusText}`);
  }
  return response.json();
}

export function getCurrentHourPrice(prices: HourlyPrice[]): number | null {
  const now = new Date();
  const currentHour = prices.find((p) => {
    const start = new Date(p.time_start);
    const end = new Date(p.time_end);
    return now >= start && now < end;
  });
  return currentHour?.SEK_per_kWh ?? null;
}

export function getPriceLevel(price: number, min: number, max: number): "low" | "medium" | "high" {
  const range = max - min;
  if (range === 0) return "medium";
  const normalized = (price - min) / range;
  if (normalized < 0.33) return "low";
  if (normalized < 0.67) return "medium";
  return "high";
}
