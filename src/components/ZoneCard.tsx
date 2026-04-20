"use client";

import { ZoneData, getPriceLevel } from "@/lib/electricity";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatHour(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Stockholm",
  });
}

interface ZoneCardProps {
  data: ZoneData;
}

const priceLevelConfig = {
  low: {
    bg: "from-green-500/20 to-green-600/10",
    badge: "bg-green-500/20 text-green-300 border-green-500/30",
    label: "Lågt",
    color: "#4ade80",
  },
  medium: {
    bg: "from-yellow-500/20 to-yellow-600/10",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    label: "Medel",
    color: "#facc15",
  },
  high: {
    bg: "from-red-500/20 to-red-600/10",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    label: "Högt",
    color: "#f87171",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-slate-400">{label}</p>
        <p className="text-white font-semibold">{payload[0].value.toFixed(2)} kr/kWh</p>
      </div>
    );
  }
  return null;
}

export default function ZoneCard({ data }: ZoneCardProps) {
  if (data.error) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-300">{data.zone}</h2>
        <p className="text-slate-500 mt-2 text-sm">{data.zoneName}</p>
        <p className="text-red-400 mt-4 text-sm">{data.error}</p>
      </div>
    );
  }

  const level =
    data.currentPrice !== null
      ? getPriceLevel(data.currentPrice, data.minPrice, data.maxPrice)
      : "medium";
  const config = priceLevelConfig[level];

  const chartData = data.prices.map((p) => ({
    time: formatHour(p.time_start),
    price: parseFloat(p.SEK_per_kWh.toFixed(3)),
    isCurrent: (() => {
      const now = new Date();
      const start = new Date(p.time_start);
      const end = new Date(p.time_end);
      return now >= start && now < end;
    })(),
  }));

  const currentHourIndex = chartData.findIndex((d) => d.isCurrent);

  return (
    <div
      className={`bg-gradient-to-br ${config.bg} bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600 transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{data.zone}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">{data.zoneName}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">
            {data.currentPrice !== null ? data.currentPrice.toFixed(2) : "–"}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">kr/kWh nu</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Lägst</span>
          </div>
          <p className="text-white font-semibold text-sm">{data.minPrice.toFixed(2)}</p>
          <p className="text-slate-500 text-xs">kr/kWh</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <Minus className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Snitt</span>
          </div>
          <p className="text-white font-semibold text-sm">{data.avgPrice.toFixed(2)}</p>
          <p className="text-slate-500 text-xs">kr/kWh</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Högst</span>
          </div>
          <p className="text-white font-semibold text-sm">{data.maxPrice.toFixed(2)}</p>
          <p className="text-slate-500 text-xs">kr/kWh</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id={`gradient-${data.zone}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={config.color}
              strokeWidth={2}
              fill={`url(#gradient-${data.zone})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {currentHourIndex >= 0 && (
        <p className="text-slate-500 text-xs text-center mt-2">
          Nuvarande timme markeras kl {chartData[currentHourIndex].time}
        </p>
      )}
    </div>
  );
}
