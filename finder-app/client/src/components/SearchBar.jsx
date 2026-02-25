import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Folder, FileText, File, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

function getFileIcon(item) {
  if (item.type === "folder") return Folder;
  const ext = item.name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return Image;
  if (["pdf", "doc", "docx", "md", "txt"].includes(ext)) return FileText;
  return File;
}

export default function SearchBar({ allItems, onNavigate, onFocusFinder }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // filter items by name or tag
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems
      .filter((item) => {
        if (item.id === "root") return false;
        const nameMatch = item.name.toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) =>
          t.toLowerCase().includes(q)
        );
        return nameMatch || tagMatch;
      })
      .slice(0, 12);
  }, [query, allItems]);

  // close on outside click
  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handle = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const handleSelect = (item) => {
    if (item.type === "folder") {
      onNavigate?.(item.id);
    } else {
      // navigate to parent folder of the file
      onNavigate?.(item.parentId);
    }
    onFocusFinder?.();
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ── Search trigger / input ──────────────────────────── */}
      <div
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5",
          "bg-white/[0.06] hover:bg-white/[0.1]",
          "border border-white/[0.08] rounded-lg",
          "cursor-text transition-colors",
          "w-72 max-w-[40vw]",
          open && "bg-white/[0.1] border-cyan-500/30"
        )}
      >
        <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder='Search by name... Try "Find invoices from last quarter"'
          className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/30 outline-none"
        />
        {query && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-white/30 hover:text-white/60"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <kbd className="hidden sm:inline text-[10px] text-white/20 border border-white/10 rounded px-1 py-0.5">
          ⌘K
        </kbd>
      </div>

      {/* ── Dropdown results ────────────────────────────────── */}
      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-2 left-0 right-0 z-[10001]",
              "bg-[#1e1e2e]/98 backdrop-blur-2xl",
              "border border-white/[0.1] rounded-xl shadow-2xl",
              "max-h-80 overflow-auto py-1"
            )}
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-white/30">
                No files match "{query}"
              </div>
            ) : (
              results.map((item) => {
                const Icon = getFileIcon(item);
                const isFolder = item.type === "folder";
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2",
                      "hover:bg-white/[0.06] text-left transition-colors",
                      "cursor-default"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 shrink-0",
                        isFolder ? "text-cyan-400" : "text-white/40"
                      )}
                      strokeWidth={1.5}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">
                        {item.name}
                      </p>
                      {item.tags?.length > 0 && (
                        <div className="flex gap-1 mt-0.5">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] text-white/30 bg-white/[0.05] px-1.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-white/20">
                      {item.size || ""}
                    </span>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
