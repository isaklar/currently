# ⚡ Currently

En Next.js-applikation som visar dagens elpriser för alla svenska elprisområden (SE1–SE4) med Server-Side Rendering.

## Funktioner

- 🔴 Realtidspriser per timme för SE1, SE2, SE3 och SE4
- 📈 Interaktivt prisdiagram per zon (24h)
- 🟢/🟡/🔴 Prisnivåindikator (lågt / medel / högt) baserat på dagens spann
- 🔄 Data hämtas server-side och cacheas i 1 timme (ISR)
- 📱 Responsiv design

## Beroenden

| Paket | Version | Syfte |
|-------|---------|-------|
| `next` | 14+ | React-ramverk med App Router & SSR |
| `react` | 18+ | UI-bibliotek |
| `typescript` | 5+ | Statisk typning |
| `tailwindcss` | 3+ | Utility-first CSS |
| `recharts` | 2+ | Prisdiagram (AreaChart) |
| `date-fns` | 3+ | Datumformatering |
| `lucide-react` | latest | Ikoner |

## Komma igång

### Förutsättningar

- Node.js 18.17 eller senare
- npm, yarn eller pnpm

### Installation

```bash
# Klona repot
git clone <repo-url>
cd currently

# Installera beroenden
npm install

# Starta utvecklingsservern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Bygga för produktion

```bash
npm run build
npm start
```

## Datakälla

Elpriserna hämtas från [elprisetjustnu.se](https://www.elprisetjustnu.se) — ett gratis, öppet API utan autentisering.

API-anrop: `https://www.elprisetjustnu.se/api/v1/prices/{år}/{månad}-{dag}_{zon}.json`

## Arkitektur

```
src/
├── app/
│   ├── layout.tsx       # Root layout med metadata
│   └── page.tsx         # Server Component – hämtar data för alla zoner parallellt
├── components/
│   ├── Header.tsx        # Sidans rubrik med datum
│   └── ZoneCard.tsx      # Klient-komponent med prisdiagram per zon
└── lib/
    └── electricity.ts    # API-funktioner och datatyper
```

## Miljövariabler

Inga miljövariabler krävs – API:et är öppet.

