import {
  Folder,
  Trash2,
  FileText,
  Settings,
  Terminal as TerminalIcon,
  Globe,
} from "lucide-react";
import { useWindowManager } from "../hooks/useWindowManager";
import { useFileSystem } from "../hooks/useFileSystem";
import DesktopIcon from "./DesktopIcon";
import Dock from "./Dock";
import Window from "./Window";
import MenuBar from "./MenuBar";
import FinderWindow from "./FinderWindow";
import SearchBar from "./SearchBar";

// ── Window registry ────────────────────────────────────────
const WINDOW_DEFS = [
  { id: "finder",   title: "Finder",    icon: Folder, isOpen: true },
  { id: "trash",    title: "Trash",     icon: Trash2 },
  { id: "notes",    title: "Notes",     icon: FileText },
  { id: "settings", title: "Settings",  icon: Settings },
  { id: "terminal", title: "Terminal",  icon: TerminalIcon },
  { id: "browser",  title: "Browser",   icon: Globe },
];

// ── Placeholder content per window ─────────────────────────
function WindowContent({ id, fs }) {
  const styles = "flex items-center justify-center h-full text-white/40 text-sm";

  switch (id) {
    case "finder":
      return <FinderWindow fs={fs} />;

    case "trash":
      return (
        <div className={styles}>
          <Trash2 className="w-16 h-16 text-white/10 mr-3" />
          Trash is empty
        </div>
      );

    case "terminal":
      return (
        <div className="h-full bg-[#0d0d14] p-3 font-mono text-sm text-green-400/80">
          <p>user@finder-app ~ %</p>
          <p className="mt-1 animate-pulse">▌</p>
        </div>
      );

    default:
      return <div className={styles}>No content yet</div>;
  }
}

// ── Desktop ────────────────────────────────────────────────
export default function Desktop() {
  const fs = useFileSystem();

  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    bringToFront,
    moveWindow,
  } = useWindowManager(WINDOW_DEFS);

  // clicking a desktop icon: open or focus
  const handleIconClick = (id) => {
    const w = windows.find((w) => w.id === id);
    if (!w) return;
    if (w.isOpen && !w.isMinimized) {
      bringToFront(id);
    } else {
      openWindow(id);
    }
  };

  // clicking a dock icon: restore / focus, or open
  const handleDockClick = (id) => {
    const w = windows.find((w) => w.id === id);
    if (!w) return;
    if (w.isOpen && w.isMinimized) {
      focusWindow(id);
    } else if (w.isOpen) {
      bringToFront(id);
    } else {
      openWindow(id);
    }
  };

  // search result → navigate inside finder + open/focus finder window
  const handleSearchNavigate = (folderId) => {
    fs.navigate(folderId);
  };
  const handleFocusFinder = () => {
    handleIconClick("finder");
  };

  // icons to show on desktop (subset)
  const desktopIcons = windows.filter((w) =>
    ["finder", "trash", "notes", "terminal"].includes(w.id)
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#1a1a3e] to-[#24243e]">
      {/* ── Menu Bar ──────────────────────────────────────── */}
      <MenuBar />

      {/* ── Desktop Icons ─────────────────────────────────── */}
      <div className="absolute top-10 right-4 flex flex-col gap-2 pt-2">
        {desktopIcons.map((w) => (
          <DesktopIcon
            key={w.id}
            icon={w.icon}
            label={w.title}
            onClick={() => handleIconClick(w.id)}
          />
        ))}
      </div>

      {/* ── Windows ───────────────────────────────────────── */}
      {windows.map((w) => (
        <Window
          key={w.id}
          {...w}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onToggleMaximize={toggleMaximize}
          onFocus={bringToFront}
          onMove={moveWindow}
          titleBarContent={
            w.id === "finder" ? (
              <SearchBar
                allItems={fs.items}
                onNavigate={handleSearchNavigate}
                onFocusFinder={handleFocusFinder}
              />
            ) : null
          }
        >
          <WindowContent id={w.id} fs={fs} />
        </Window>
      ))}

      {/* ── Dock ──────────────────────────────────────────── */}
      <Dock windows={windows} onDockClick={handleDockClick} />
    </div>
  );
}
