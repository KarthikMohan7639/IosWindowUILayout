import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Window({
  id,
  title,
  icon: Icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  position,
  size,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onMove,
  children,
}) {
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // ── drag handling ────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e) => {
      if (isMaximized) return;
      e.preventDefault();
      onFocus(id);
      setDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [id, isMaximized, onFocus, position]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      onMove(id, {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const handleUp = () => setDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging, id, onMove]);

  // ── animation variants ───────────────────────────────────
  const variants = {
    hidden: { opacity: 0, scale: 0.85, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0 },
    minimized: { opacity: 0, scale: 0.5, y: 200 },
  };

  const currentVariant = isMinimized ? "minimized" : "visible";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dragRef}
          initial="hidden"
          animate={currentVariant}
          exit="hidden"
          variants={variants}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          onPointerDown={() => onFocus(id)}
          className={cn(
            "absolute flex flex-col",
            "bg-[#1e1e2e]/95 backdrop-blur-xl",
            "border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden",
            "select-none",
            isMaximized && "!inset-0 !rounded-none !w-full !h-full"
          )}
          style={
            isMaximized
              ? { zIndex, position: "absolute", inset: 0, width: "100%", height: "100%" }
              : {
                  zIndex,
                  left: position.x,
                  top: position.y,
                  width: size.w,
                  height: size.h,
                }
          }
        >
          {/* ── Title Bar ─────────────────────────────────── */}
          <div
            onPointerDown={handlePointerDown}
            onDoubleClick={() => onToggleMaximize(id)}
            className={cn(
              "flex items-center h-11 px-3 gap-3 shrink-0",
              "bg-[#181825] border-b border-white/[0.06]",
              "cursor-default"
            )}
          >
            {/* traffic lights */}
            <div className="flex items-center gap-2">
              <TrafficLight
                color="bg-[#ff5f57]"
                hoverColor="hover:bg-[#ff3b30]"
                onClick={() => onClose(id)}
                label="close"
              />
              <TrafficLight
                color="bg-[#febc2e]"
                hoverColor="hover:bg-[#f5a623]"
                onClick={() => onMinimize(id)}
                label="minimize"
              />
              <TrafficLight
                color="bg-[#28c840]"
                hoverColor="hover:bg-[#2dc653]"
                onClick={() => onToggleMaximize(id)}
                label="maximize"
              />
            </div>

            {/* title */}
            <div className="flex items-center gap-2 flex-1 justify-center -ml-16">
              {Icon && <Icon className="w-4 h-4 text-white/50" strokeWidth={1.5} />}
              <span className="text-sm text-white/70 truncate">{title}</span>
            </div>
          </div>

          {/* ── Window Body ───────────────────────────────── */}
          <div className="flex-1 overflow-auto">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Traffic-light button ───────────────────────────────────
function TrafficLight({ color, hoverColor, onClick, label }) {
  return (
    <button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "w-3 h-3 rounded-full transition-colors",
        color,
        hoverColor,
        "focus:outline-none"
      )}
    />
  );
}
