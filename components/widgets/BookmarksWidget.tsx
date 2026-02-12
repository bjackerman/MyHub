"use client";

import React, { useState, useEffect } from "react";

interface Bookmark {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string; // Can be a Material Symbol name, a Simple Icon name, or a full URL
  color: string;
}

interface Folder {
  id: string;
  name: string;
  bookmarks: Bookmark[];
}

interface BookmarksWidgetProps {
  isLocked?: boolean;
}

const DEFAULT_FOLDERS: Folder[] = [
  {
    id: "f-dev",
    name: "Development",
    bookmarks: [
      {
        id: "b-gh",
        name: "GitHub",
        url: "https://github.com",
        description: "Source control and collaboration",
        icon: "github",
        color: "text-white",
      },
      {
        id: "b-vc",
        name: "Vercel",
        url: "https://vercel.com",
        description: "Deployment and hosting platform",
        icon: "vercel",
        color: "text-white",
      },
      {
        id: "b-nx",
        name: "Next.js",
        url: "https://nextjs.org",
        description: "The React Framework",
        icon: "nextdotjs",
        color: "text-white",
      },
    ],
  },
  {
    id: "f-des",
    name: "Design",
    bookmarks: [
      {
        id: "b-fg",
        name: "Figma",
        url: "https://figma.com",
        description: "Collaborative interface design tool",
        icon: "figma",
        color: "text-white",
      },
    ],
  },
];

const BookmarksWidget: React.FC<BookmarksWidgetProps> = ({ isLocked }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState<{
    folderId: string | null;
    type: "bookmark" | "folder";
  }>({ folderId: null, type: "bookmark" });

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("widget-bookmarks");
    if (saved) {
      try {
        setFolders(JSON.parse(saved));
      } catch (e) {
        setFolders(DEFAULT_FOLDERS);
      }
    } else {
      setFolders(DEFAULT_FOLDERS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("widget-bookmarks", JSON.stringify(folders));
    }
  }, [folders, isLoaded]);

  const addFolder = () => {
    if (!formData.name.trim()) return;
    const newFolder: Folder = {
      id: `f-${Date.now()}`,
      name: formData.name,
      bookmarks: [],
    };
    setFolders([...folders, newFolder]);
    resetForm();
  };

  const addBookmark = (folderId: string) => {
    if (!formData.name.trim() || !formData.url.trim()) return;
    
    const formattedUrl = formData.url.startsWith("http")
      ? formData.url
      : `https://${formData.url}`;

    const newBookmark: Bookmark = {
      id: `b-${Date.now()}`,
      name: formData.name,
      url: formattedUrl,
      description: formData.description,
      // If icon is empty, we'll use the favicon service in the render
      icon: formData.icon.trim(),
      color: "text-white",
    };

    setFolders(
      folders.map((f) =>
        f.id === folderId ? { ...f, bookmarks: [...f.bookmarks, newBookmark] } : f
      )
    );
    resetForm();
  };

  const removeBookmark = (folderId: string, bookmarkId: string) => {
    setFolders(
      folders.map((f) =>
        f.id === folderId
          ? { ...f, bookmarks: f.bookmarks.filter((b) => b.id !== bookmarkId) }
          : f
      )
    );
  };

  const removeFolder = (folderId: string) => {
    setFolders(folders.filter((f) => f.id !== folderId));
  };

  const resetForm = () => {
    setFormData({ name: "", url: "", description: "", icon: "" });
    setShowAddForm({ folderId: null, type: "bookmark" });
  };

  const renderIcon = (bookmark: Bookmark) => {
    const icon = bookmark.icon;
    
    // 1. If no icon, use favicon service
    if (!icon) {
      const domain = new URL(bookmark.url).hostname;
      return (
        <img 
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
          alt="" 
          className="size-5 object-contain"
        />
      );
    }

    // 2. If it's a full URL
    if (icon.startsWith("http")) {
      return <img src={icon} alt="" className="size-5 object-contain" />;
    }

    // 3. Try as Simple Icon (slug) - check if it's likely a brand slug (no spaces, lowercase)
    const isLikelyBrand = /^[a-z0-9-]+$/.test(icon);
    if (isLikelyBrand && icon.length > 2) {
       return (
        <img 
          src={`https://cdn.simpleicons.org/${icon}`} 
          alt="" 
          className="size-5 object-contain"
          onError={(e) => {
            // Fallback to material symbol if simple icon fails
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const span = document.createElement('span');
              span.className = "material-symbols-outlined text-[20px]";
              span.innerText = icon;
              parent.appendChild(span);
            }
          }}
        />
      );
    }

    // 4. Default to Material Symbol
    return (
      <span className="material-symbols-outlined text-[20px]">
        {icon}
      </span>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="flex-1 p-3 widget-scroll overflow-y-auto">
      <div className="flex flex-col gap-6">
        {folders.map((folder) => (
          <div key={folder.id} className="flex flex-col gap-2 relative group/folder">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#586b75]">
                {folder.name}
              </h3>
              {!isLocked && (
                <button
                  onClick={() => removeFolder(folder.id)}
                  className="opacity-0 group-hover/folder:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {folder.bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="relative group/item flex items-center">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-start gap-3 p-2 rounded-lg hover:bg-surface-border transition-colors"
                  >
                    <div
                      className={`size-10 rounded-lg bg-background-dark flex items-center justify-center shrink-0 border border-surface-border group-hover/item:border-primary/50 transition-colors text-white overflow-hidden`}
                    >
                      {renderIcon(bookmark)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm font-semibold truncate">
                          {bookmark.name}
                        </p>
                        <span className="material-symbols-outlined text-[14px] text-[#586b75] opacity-0 group-hover/item:opacity-100 transition-opacity">
                          open_in_new
                        </span>
                      </div>
                      <p className="text-[#9db0b9] text-[11px] truncate mt-0.5">
                        {bookmark.description}
                      </p>
                    </div>
                  </a>
                  {!isLocked && (
                    <button
                      onClick={() => removeBookmark(folder.id, bookmark.id)}
                      className="absolute right-8 opacity-0 group-hover/item:opacity-100 p-1 text-red-400/50 hover:text-red-400 transition-all cursor-pointer bg-background-dark/80 rounded"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!isLocked && showAddForm.folderId !== folder.id && (
              <button
                onClick={() =>
                  setShowAddForm({ folderId: folder.id, type: "bookmark" })
                }
                className="mx-1 mt-1 py-1 text-[10px] text-primary/60 hover:text-primary font-bold border border-dashed border-primary/20 hover:border-primary/40 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[12px]">add</span>
                Add Bookmark
              </button>
            )}

            {showAddForm.folderId === folder.id && showAddForm.type === "bookmark" && (
              <div className="m-1 p-3 bg-background-dark/50 border border-primary/30 rounded-lg animate-in fade-in zoom-in duration-200">
                <input
                  autoFocus
                  className="w-full bg-transparent border-b border-surface-border mb-2 text-xs text-white focus:border-primary outline-none py-1"
                  placeholder="Name (e.g. GitHub)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="w-full bg-transparent border-b border-surface-border mb-2 text-xs text-white focus:border-primary outline-none py-1"
                  placeholder="URL (e.g. github.com)"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <input
                  className="w-full bg-transparent border-b border-surface-border mb-2 text-xs text-white focus:border-primary outline-none py-1"
                  placeholder="Icon (brand name, material symbol, or leave empty)"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
                <input
                  className="w-full bg-transparent border-b border-surface-border mb-3 text-xs text-white focus:border-primary outline-none py-1"
                  placeholder="Description (Optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addBookmark(folder.id)}
                    className="flex-1 py-1.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary/80 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 py-1.5 bg-surface-border text-[#9db0b9] text-[10px] font-bold rounded hover:bg-surface-border/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!isLocked && showAddForm.type !== "folder" && (
          <div className="mt-2 border-t border-surface-border pt-4 px-1">
            <button
              onClick={() => setShowAddForm({ folderId: "new", type: "folder" })}
              className="w-full py-2 text-xs text-[#9db0b9] font-bold hover:bg-surface-border/30 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer border border-dashed border-[#586b75]/30"
            >
              <span className="material-symbols-outlined text-[18px]">
                create_new_folder
              </span>
              New Folder
            </button>
          </div>
        )}

        {showAddForm.type === "folder" && (
          <div className="m-1 p-3 bg-background-dark/50 border border-primary/30 rounded-lg">
            <input
              autoFocus
              className="w-full bg-transparent border-b border-surface-border mb-3 text-xs text-white focus:border-primary outline-none py-1"
              placeholder="Folder Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                onClick={addFolder}
                className="flex-1 py-1.5 bg-primary text-white text-[10px] font-bold rounded hover:bg-primary/80 transition-colors"
              >
                Create Folder
              </button>
              <button
                onClick={resetForm}
                className="flex-1 py-1.5 bg-surface-border text-[#9db0b9] text-[10px] font-bold rounded hover:bg-surface-border/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksWidget;
