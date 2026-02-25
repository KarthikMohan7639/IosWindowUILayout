import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function ContextMenu({ items, position, onClose }) {
  const ref = useRef(null);

  // close on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "fixed z-[99999] min-w-[180px] py-1",
          "bg-[#2a2a3d]/95 backdrop-blur-xl",
          "border border-white/[0.1] rounded-lg shadow-2xl",
          "text-sm text-white/80"
        )}
        style={{ left: position.x, top: position.y }}
      >
        {items.map((item, i) =>
          item.separator ? (
            <div
              key={`sep-${i}`}
              className="my-1 border-t border-white/[0.08]"
            />
          ) : (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                onClose();
              }}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-1.5 text-left",
                "hover:bg-white/[0.08] disabled:opacity-30 disabled:pointer-events-none",
                "transition-colors cursor-default",
                item.danger && "text-red-400 hover:bg-red-500/10"
              )}
            >
              {item.icon && (
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              )}
              {item.label}
              {item.shortcut && (
                <span className="ml-auto text-[11px] text-white/30">
                  {item.shortcut}
                </span>
              )}
            </button>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ── helper hook to manage context-menu state ───────────────
export function useContextMenu() {
  const [menu, setMenu] = useState({ position: null, items: [] });

  const openMenu = (e, items) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ position: { x: e.clientX, y: e.clientY }, items });
  };

  const closeMenu = () => setMenu({ position: null, items: [] });

  return { menu, openMenu, closeMenu };
}
