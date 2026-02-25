import { useState, useCallback } from "react";

/*
  Each window entry:
  {
    id:         string,
    title:      string,
    icon:       LucideIcon component,
    isOpen:     boolean,
    isMinimized:boolean,
    isMaximized:boolean,
    zIndex:     number,
    position:   { x, y },
    size:       { w, h },
  }
*/

let nextZ = 10; // global z-index counter

export function useWindowManager(initialWindows = []) {
  const [windows, setWindows] = useState(() => {
    // responsive default sizes
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const defaultW = Math.min(780, vw - 100);
    const defaultH = Math.min(500, vh - 140);

    return initialWindows.map((w, i) => ({
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ++,
      position: {
        x: Math.min(80 + i * 30, vw - defaultW - 20),
        y: Math.min(60 + i * 30, vh - defaultH - 80),
      },
      size: { w: defaultW, h: defaultH },
      ...w,
    }));
  }
  );

  // ── helpers ──────────────────────────────────────────────
  const update = useCallback(
    (id, patch) =>
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
      ),
    []
  );

  const bringToFront = useCallback(
    (id) => {
      const z = nextZ++;
      update(id, { zIndex: z });
    },
    [update]
  );

  // ── public API ───────────────────────────────────────────
  const openWindow = useCallback(
    (id) => {
      const z = nextZ++;
      update(id, { isOpen: true, isMinimized: false, zIndex: z });
    },
    [update]
  );

  const closeWindow = useCallback(
    (id) => update(id, { isOpen: false, isMinimized: false, isMaximized: false }),
    [update]
  );

  const minimizeWindow = useCallback(
    (id) => update(id, { isMinimized: true }),
    [update]
  );

  const toggleMaximize = useCallback(
    (id) =>
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZ++ } : w
        )
      ),
    []
  );

  const focusWindow = useCallback(
    (id) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ++ }
            : w
        )
      );
    },
    []
  );

  const moveWindow = useCallback(
    (id, position) => update(id, { position }),
    [update]
  );

  const resizeWindow = useCallback(
    (id, size) => update(id, { size }),
    [update]
  );

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    bringToFront,
    moveWindow,
    resizeWindow,
  };
}
