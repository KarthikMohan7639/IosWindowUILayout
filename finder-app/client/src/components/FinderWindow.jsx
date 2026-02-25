import { Folder } from "lucide-react";
import FileList from "./FileList";
import { cn } from "../lib/utils";

export default function FinderWindow({ fs }) {
  const {
    children,
    currentFolder,
    currentFolderId,
    breadcrumbs,
    sidebarFolders,
    navigate,
    navigateUp,
    createFolder,
    createFile,
    deleteItem,
    renameItem,
  } = fs;

  return (
    <div className="flex h-full">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="w-48 shrink-0 border-r border-white/[0.06] bg-white/[0.02] p-3 space-y-0.5 overflow-auto">
        <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2 px-2">
          Folders
        </p>
        {sidebarFolders.map((f) => (
          <button
            key={f.id}
            onClick={() => navigate(f.id)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-white/60",
              "hover:bg-white/[0.06] cursor-default transition-colors text-left",
              currentFolderId === f.id && "bg-white/[0.08] text-white/90"
            )}
          >
            <Folder className="w-4 h-4 text-cyan-400 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{f.name}</span>
          </button>
        ))}
      </div>

      {/* ── Main file area ──────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <FileList
          currentFolder={currentFolder}
          breadcrumbs={breadcrumbs}
          onNavigate={navigate}
          onNavigateUp={navigateUp}
          onCreateFolder={createFolder}
          onCreateFile={createFile}
          onDelete={deleteItem}
          onRename={renameItem}
        >
          {children}
        </FileList>
      </div>
    </div>
  );
}
