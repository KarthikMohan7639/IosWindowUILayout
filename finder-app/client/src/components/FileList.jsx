import { useState } from "react";
import {
  Folder,
  FileText,
  Image,
  File,
  ChevronRight,
  FolderPlus,
  FilePlus,
  Trash2,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import ContextMenu, { useContextMenu } from "./ContextMenu";

// ── icon by extension / type ───────────────────────────────
function getFileIcon(item) {
  if (item.type === "folder") return Folder;
  const ext = item.name.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return Image;
  if (["pdf", "doc", "docx", "md", "txt"].includes(ext)) return FileText;
  return File;
}

function tagColor(tag) {
  const map = {
    NDA: "bg-red-500/20 text-red-300",
    Legal: "bg-red-500/20 text-red-300",
    Invoice: "bg-purple-500/20 text-purple-300",
    Stripe: "bg-purple-500/20 text-purple-300",
    Finance: "bg-emerald-500/20 text-emerald-300",
    Q4: "bg-emerald-500/20 text-emerald-300",
    Project: "bg-blue-500/20 text-blue-300",
    Design: "bg-pink-500/20 text-pink-300",
    Notes: "bg-yellow-500/20 text-yellow-300",
    Meeting: "bg-yellow-500/20 text-yellow-300",
    Photo: "bg-cyan-500/20 text-cyan-300",
    Resume: "bg-orange-500/20 text-orange-300",
    Installer: "bg-gray-500/20 text-gray-300",
  };
  return map[tag] || "bg-white/10 text-white/50";
}

// ── inline rename input ────────────────────────────────────
function InlineInput({ initial, onSubmit, onCancel, placeholder }) {
  const [value, setValue] = useState(initial || "");
  return (
    <input
      autoFocus
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit(value);
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => (value.trim() ? onSubmit(value) : onCancel())}
      className="bg-white/10 border border-cyan-400/40 rounded px-2 py-0.5 text-sm text-white outline-none w-48"
    />
  );
}

// ── FileList ───────────────────────────────────────────────
export default function FileList({
  children: items,
  currentFolder,
  breadcrumbs,
  onNavigate,
  onNavigateUp,
  onCreateFolder,
  onCreateFile,
  onDelete,
  onRename,
}) {
  const { menu, openMenu, closeMenu } = useContextMenu();
  const [creating, setCreating] = useState(null); // "folder" | "file" | null
  const [renamingId, setRenamingId] = useState(null);
  const [selected, setSelected] = useState(null);

  // sort: folders first, then alphabetical
  const sorted = [...items].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  // ── context-menu for blank area ──────────────────────────
  const handleAreaContext = (e) => {
    openMenu(e, [
      {
        label: "New Folder",
        icon: FolderPlus,
        shortcut: "⇧⌘N",
        action: () => setCreating("folder"),
      },
      {
        label: "New File",
        icon: FilePlus,
        action: () => setCreating("file"),
      },
    ]);
  };

  // ── context-menu for an item ─────────────────────────────
  const handleItemContext = (e, item) => {
    setSelected(item.id);
    openMenu(e, [
      {
        label: "Rename",
        icon: Pencil,
        action: () => setRenamingId(item.id),
      },
      { separator: true },
      {
        label: "Delete",
        icon: Trash2,
        danger: true,
        action: () => onDelete(item.id),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── toolbar / breadcrumbs ──────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <button
          onClick={onNavigateUp}
          disabled={!currentFolder?.parentId}
          className="p-1 rounded hover:bg-white/[0.08] disabled:opacity-20 text-white/60"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-1 text-sm text-white/50">
          {breadcrumbs.map((b, i) => (
            <span key={b.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-white/20" />}
              <button
                onClick={() => onNavigate(b.id)}
                className={cn(
                  "hover:text-white/80 transition-colors",
                  i === breadcrumbs.length - 1 && "text-white/80 font-medium"
                )}
              >
                {b.name}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ── file list area ────────────────────────────────── */}
      <div
        className="flex-1 overflow-auto"
        onContextMenu={handleAreaContext}
      >
        {/* ── column headers ────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_120px_100px_80px] gap-2 px-4 py-2 border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30 select-none">
          <span>Name</span>
          <span>Tags</span>
          <span>Modified</span>
          <span className="text-right">Size</span>
        </div>

        {/* ── creating new item inline ──────────────────────── */}
        {creating && (
          <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]">
            {creating === "folder" ? (
              <Folder className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
            ) : (
              <File className="w-5 h-5 text-white/40" strokeWidth={1.5} />
            )}
            <InlineInput
              placeholder={creating === "folder" ? "Folder name" : "File name"}
              onSubmit={(name) => {
                if (creating === "folder") onCreateFolder(name);
                else onCreateFile(name);
                setCreating(null);
              }}
              onCancel={() => setCreating(null)}
            />
          </div>
        )}

        {/* ── items ─────────────────────────────────────────── */}
        {sorted.length === 0 && !creating && (
          <div className="flex flex-col items-center justify-center h-48 text-white/20 text-sm">
            <Folder className="w-12 h-12 mb-2 text-white/10" />
            This folder is empty
            <span className="text-[11px] mt-1 text-white/15">
              Right-click to create a file or folder
            </span>
          </div>
        )}

        {sorted.map((item, i) => {
          const Icon = getFileIcon(item);
          const isFolder = item.type === "folder";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(item.id)}
              onDoubleClick={() => isFolder && onNavigate(item.id)}
              onContextMenu={(e) => handleItemContext(e, item)}
              className={cn(
                "grid grid-cols-[1fr_120px_100px_80px] gap-2 items-center",
                "px-4 py-2 cursor-default select-none",
                "border-b border-white/[0.03]",
                "hover:bg-white/[0.04] transition-colors",
                selected === item.id && "bg-white/[0.07]"
              )}
            >
              {/* name */}
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isFolder ? "text-cyan-400" : "text-white/40"
                  )}
                  strokeWidth={1.5}
                />
                {renamingId === item.id ? (
                  <InlineInput
                    initial={item.name}
                    onSubmit={(name) => {
                      onRename(item.id, name);
                      setRenamingId(null);
                    }}
                    onCancel={() => setRenamingId(null)}
                  />
                ) : (
                  <span className="truncate text-sm text-white/80">
                    {item.name}
                  </span>
                )}
              </div>

              {/* tags */}
              <div className="flex gap-1 flex-wrap">
                {(item.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-medium",
                      tagColor(tag)
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* modified */}
              <span className="text-[13px] text-white/40">
                {item.modified || "—"}
              </span>

              {/* size */}
              <span className="text-[13px] text-white/40 text-right">
                {item.size || "—"}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── context menu portal ───────────────────────────── */}
      {menu.position && (
        <ContextMenu
          items={menu.items}
          position={menu.position}
          onClose={closeMenu}
        />
      )}
    </div>
  );
}
