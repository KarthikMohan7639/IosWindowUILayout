import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Dock({ windows, onDockClick }) {
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999]",
        "flex items-end gap-1 px-3 py-1.5",
        "bg-white/10 backdrop-blur-2xl border border-white/20",
        "rounded-2xl shadow-2xl"
      )}
    >
      {windows.map((w) => (
        <DockItem
          key={w.id}
          icon={w.icon}
          label={w.title}
          isOpen={w.isOpen}
          isMinimized={w.isMinimized}
          onClick={() => onDockClick(w.id)}
        />
      ))}
    </motion.div>
  );
}

function DockItem({ icon: Icon, label, isOpen, isMinimized, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.25, y: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "relative flex flex-col items-center p-1.5 rounded-xl",
        "cursor-default focus:outline-none group"
      )}
      title={label}
    >
      <Icon
        className={cn(
          "w-11 h-11 drop-shadow-lg transition-opacity",
          isMinimized && "opacity-50"
        )}
        strokeWidth={1.5}
      />

      {/* tooltip */}
      <span
        className={cn(
          "absolute -top-8 px-2 py-0.5 text-[11px] rounded-md",
          "bg-gray-900/90 text-white whitespace-nowrap",
          "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        )}
      >
        {label}
      </span>

      {/* dot indicator */}
      <AnimatePresence>
        {isOpen && (
          <motion.span
            layoutId={`dot-${label}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-white/80"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
