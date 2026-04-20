# ⚡ Currently

A Next.js application that displays today's electricity prices for all Swedish pricing zones (SE1–SE4) with Server-Side Rendering.

## Features

- 🔴 Real-time hourly prices for SE1, SE2, SE3, and SE4
- 📈 Interactive price chart per zone (24h)
- 🟢/🟡/🔴 Price level indicator (low / medium / high) based on the daily range
- 🔄 Server-side data fetching with 1-hour cache (ISR)
- 📱 Responsive design

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14+ | React framework with App Router & SSR |
| `react` | 18+ | UI library |
| `typescript` | 5+ | Static typing |
| `tailwindcss` | 3+ | Utility-first CSS |
| `recharts` | 2+ | Price chart (AreaChart) |
| `date-fns` | 3+ | Date formatting |
| `lucide-react` | latest | Icons |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd currently

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Data Source

Electricity prices are fetched from [elprisetjustnu.se](https://www.elprisetjustnu.se) — a free, open API with no authentication required.

API call: `https://www.elprisetjustnu.se/api/v1/prices/{year}/{month}-{day}_{zone}.json`

## Architecture

```
src/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Server Component – fetches data for all zones in parallel
├── components/
│   ├── Header.tsx        # Page header with date
│   └── ZoneCard.tsx      # Client component with price chart per zone
└── lib/
    └── electricity.ts    # API functions and data types
```

## Environment Variables

No environment variables required — the API is open and public.

