import { useState, useCallback, useEffect } from "react";

// ── seed data ──────────────────────────────────────────────
const STORAGE_KEY = "finder-fs-v2";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const SEED = [
  { id: "root", name: "Root", type: "folder", parentId: null },
  { id: "documents", name: "Documents", type: "folder", parentId: "root" },
  { id: "downloads", name: "Downloads", type: "folder", parentId: "root" },
  { id: "projects", name: "Projects", type: "folder", parentId: "root" },
  { id: "invoices", name: "Invoices", type: "folder", parentId: "root" },
  { id: "contracts", name: "Contracts", type: "folder", parentId: "root" },
  { id: "personal", name: "Personal", type: "folder", parentId: "root" },
  // sample files
  { id: "f1", name: "contract-nda-acme.pdf", type: "file", parentId: "documents", tags: ["NDA", "Legal"], size: "2.4 MB", modified: "Feb 12" },
  { id: "f2", name: "stripe-invoice-dec.pdf", type: "file", parentId: "invoices", tags: ["Invoice", "Stripe"], size: "148 KB", modified: "Dec 18" },
  { id: "f3", name: "project-brief-v3.docx", type: "file", parentId: "projects", tags: ["Brief", "Project"], size: "890 KB", modified: "Jan 28" },
  { id: "f4", name: "q4-financial-report.xlsx", type: "file", parentId: "documents", tags: ["Finance", "Q4"], size: "3.1 MB", modified: "Jan 5" },
  { id: "f5", name: "design-system-v2.fig", type: "file", parentId: "projects", tags: ["Design"], size: "12 MB", modified: "Feb 8" },
  { id: "f6", name: "meeting-notes-jan.md", type: "file", parentId: "documents", tags: ["Notes", "Meeting"], size: "24 KB", modified: "Jan 30" },
  { id: "f7", name: "family-photo.jpg", type: "file", parentId: "personal", tags: ["Photo"], size: "4.2 MB", modified: "Mar 12" },
  { id: "f8", name: "vacation-2025.png", type: "file", parentId: "downloads", tags: ["Photo"], size: "6.8 MB", modified: "Jul 20" },
  { id: "f9", name: "resume-2026.pdf", type: "file", parentId: "personal", tags: ["Resume"], size: "320 KB", modified: "Feb 1" },
  { id: "f10", name: "app-installer.dmg", type: "file", parentId: "downloads", tags: ["Installer"], size: "95 MB", modified: "Feb 22" },
];

function loadFS() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
  return SEED;
}

// ── hook ───────────────────────────────────────────────────
export function useFileSystem() {
  const [items, setItems] = useState(loadFS);
  const [currentFolderId, setCurrentFolderId] = useState("root");

  // persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ── derived data ─────────────────────────────────────────
  const currentFolder = items.find((i) => i.id === currentFolderId) || items[0];

  // At root, show all files across all folders; otherwise show folder's direct children
  const children = currentFolderId === "root"
    ? items.filter((i) => i.type === "file")
    : items.filter((i) => i.parentId === currentFolderId);

  // build breadcrumb path from root → current
  const breadcrumbs = (() => {
    const trail = [];
    let node = currentFolder;
    while (node) {
      trail.unshift(node);
      node = items.find((i) => i.id === node.parentId);
    }
    return trail;
  })();

  // sidebar folders (top-level children of root)
  const sidebarFolders = items.filter(
    (i) => i.parentId === "root" && i.type === "folder"
  );

  // ── actions ──────────────────────────────────────────────
  const navigate = useCallback((folderId) => {
    setCurrentFolderId(folderId);
  }, []);

  const navigateUp = useCallback(() => {
    if (currentFolder && currentFolder.parentId) {
      setCurrentFolderId(currentFolder.parentId);
    }
  }, [currentFolder]);

  const createFolder = useCallback(
    (name, parentId = currentFolderId) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const newFolder = {
        id: generateId(),
        name: trimmed,
        type: "folder",
        parentId,
      };
      setItems((prev) => [...prev, newFolder]);
      return newFolder;
    },
    [currentFolderId]
  );

  const createFile = useCallback(
    (name, parentId = currentFolderId) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const newFile = {
        id: generateId(),
        name: trimmed,
        type: "file",
        parentId,
        tags: [],
        size: "0 KB",
        modified: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
      setItems((prev) => [...prev, newFile]);
      return newFile;
    },
    [currentFolderId]
  );

  const deleteItem = useCallback((id) => {
    // recursively remove item and all descendants
    setItems((prev) => {
      const toRemove = new Set();
      const collect = (targetId) => {
        toRemove.add(targetId);
        prev
          .filter((i) => i.parentId === targetId)
          .forEach((child) => collect(child.id));
      };
      collect(id);
      return prev.filter((i) => !toRemove.has(i.id));
    });
  }, []);

  const renameItem = useCallback((id, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, name: trimmed } : i))
    );
  }, []);

  return {
    items,
    currentFolder,
    currentFolderId,
    children,
    breadcrumbs,
    sidebarFolders,
    navigate,
    navigateUp,
    createFolder,
    createFile,
    deleteItem,
    renameItem,
  };
}
