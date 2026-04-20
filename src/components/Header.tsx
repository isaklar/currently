import { Zap } from "lucide-react";

interface HeaderProps {
  fetchedAt: string;
}

export default function Header({ fetchedAt }: HeaderProps) {
  const today = new Date().toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Stockholm",
  });

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="bg-yellow-400/20 p-3 rounded-2xl">
          <Zap className="w-8 h-8 text-yellow-400" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Currently</h1>
      </div>
      <p className="text-slate-300 text-lg capitalize">{today}</p>
      <p className="text-slate-500 text-sm mt-1">Senast uppdaterad: {fetchedAt}</p>
    </div>
  );
}
