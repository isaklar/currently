import { fetchZonePrice, getCurrentHourPrice, ZONES, ZoneData } from "@/lib/electricity";
import ZoneCard from "@/components/ZoneCard";
import Header from "@/components/Header";
import AutoRefresh from "@/components/AutoRefresh";

async function getZonesData(): Promise<ZoneData[]> {
  const today = new Date();

  const results = await Promise.allSettled(
    ZONES.map(async (zone) => {
      const prices = await fetchZonePrice(zone.id, today);
      const currentPrice = getCurrentHourPrice(prices);
      const priceValues = prices.map((p) => p.SEK_per_kWh);
      return {
        zone: zone.id,
        zoneName: zone.name,
        prices,
        currentPrice,
        minPrice: Math.min(...priceValues),
        maxPrice: Math.max(...priceValues),
        avgPrice: priceValues.reduce((a, b) => a + b, 0) / priceValues.length,
      } satisfies ZoneData;
    })
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return {
      zone: ZONES[i].id,
      zoneName: ZONES[i].name,
      prices: [],
      currentPrice: null,
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
      error: (result as PromiseRejectedResult).reason?.message ?? "Kunde inte hämta data",
    };
  });
}

export default async function Home() {
  const zonesData = await getZonesData();
  const fetchedAt = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <AutoRefresh />
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <Header fetchedAt={fetchedAt} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {zonesData.map((zone) => (
            <ZoneCard key={zone.zone} data={zone} />
          ))}
        </div>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          Data från{" "}
          <a
            href="https://www.elprisetjustnu.se"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-300 transition-colors"
          >
            elprisetjustnu.se
          </a>
          {" · "}Priserna visas i SEK/kWh inkl. moms
        </footer>
      </div>
    </main>
  );
}
