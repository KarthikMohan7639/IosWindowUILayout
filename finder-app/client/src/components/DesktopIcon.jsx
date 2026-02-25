import { cn } from "../lib/utils";

export default function DesktopIcon({ icon: Icon, label, onClick, selected }) {
  return (
    <button
      onClick={onClick}
      onDoubleClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 w-20 p-2 rounded-lg",
        "text-white/90 text-xs select-none cursor-default",
        "hover:bg-white/10 focus:outline-none transition-colors",
        selected && "bg-white/20"
      )}
    >
      <Icon className="w-12 h-12 drop-shadow-lg" strokeWidth={1.5} />
      <span className="truncate w-full text-center drop-shadow-md">
        {label}
      </span>
    </button>
  );
}
