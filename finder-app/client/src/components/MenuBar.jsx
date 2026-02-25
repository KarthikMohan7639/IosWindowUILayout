import { Apple, Wifi, Battery } from "lucide-react";
import SearchBar from "./SearchBar";

export default function MenuBar({ allItems, onNavigate, onFocusFinder }) {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const day = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="fixed top-0 inset-x-0 z-[10000] flex items-center justify-between h-7 px-4 bg-black/40 backdrop-blur-xl text-white/80 text-[13px] select-none">
      {/* left */}
      <div className="flex items-center gap-5">
        <Apple className="w-4 h-4" />
        <span className="font-semibold">Finder</span>
        <span className="text-white/50 hidden sm:inline">File</span>
        <span className="text-white/50 hidden sm:inline">Edit</span>
        <span className="text-white/50 hidden sm:inline">View</span>
        <span className="text-white/50 hidden sm:inline">Go</span>
        <span className="text-white/50 hidden md:inline">Window</span>
        <span className="text-white/50 hidden md:inline">Help</span>
      </div>

      {/* center – search */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <SearchBar
          allItems={allItems}
          onNavigate={onNavigate}
          onFocusFinder={onFocusFinder}
        />
      </div>

      {/* right */}
      <div className="flex items-center gap-3">
        <Battery className="w-5 h-5 text-white/60" />
        <Wifi className="w-4 h-4 text-white/60" />
        <span className="text-white/60 hidden sm:inline">
          {day} {time}
        </span>
      </div>
    </div>
  );
}
