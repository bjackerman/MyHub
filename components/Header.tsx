import React from "react";

interface HeaderProps {
  mode: "edit" | "view";
  onAddWidget?: () => void;
  onDone?: () => void;
  isLocked?: boolean;
  onToggleLock?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  mode,
  onAddWidget,
  onDone,
  isLocked,
  onToggleLock,
}) => {
  const isEditMode = mode === "edit";

  return (
    <header
      className={`flex items-center justify-between whitespace-nowrap border-b border-solid px-6 py-3 z-50 ${
        isEditMode
          ? "border-surface-border bg-surface-dark"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111618]"
      }`}
    >
      {/* Left Section: Logo & Title */}
      <div className="flex items-center gap-4">
        {isEditMode ? (
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 rounded bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">dashboard</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              DashBoard
            </h2>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="size-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">
                dashboard
              </span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Personal Hub
            </h2>
          </div>
        )}

        {/* Edit Mode Search (Visible only on md screens and up) */}
        {isEditMode && (
          <div className="hidden md:flex items-center relative w-full max-w-md ml-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#9db0b9]">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="block w-full p-2 pl-10 text-sm text-white border border-surface-border rounded-lg bg-background-dark focus:ring-primary focus:border-primary placeholder-[#9db0b9]"
              placeholder="Search widgets..."
              type="text"
            />
          </div>
        )}
      </div>

      {/* Center Section: View Mode Search */}
      {!isEditMode && (
        <div className="flex flex-1 justify-center max-w-xl px-8">
          <div className="flex w-full items-center rounded-lg bg-slate-100 dark:bg-[#283339] h-10 px-3">
            <span className="material-symbols-outlined text-slate-400 dark:text-[#9db0b9]">
              search
            </span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-sm ml-2 placeholder-slate-400 dark:placeholder-[#9db0b9] text-slate-800 dark:text-white outline-none"
              placeholder="Search the web or widgets..."
            />
            <span className="text-xs text-slate-400 dark:text-[#9db0b9] border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5">
              ⌘K
            </span>
          </div>
        </div>
      )}

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={onToggleLock}
                className={`flex items-center gap-2 cursor-pointer rounded-lg h-9 px-4 transition-colors text-sm font-bold ${
                  isLocked
                    ? "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
                    : "bg-surface-border text-white hover:bg-[#3b4b54]"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isLocked ? "lock" : "lock_open"}
                </span>
                <span className="hidden sm:inline">
                  {isLocked ? "Locked" : "Unlock"}
                </span>
              </button>
              <button
                onClick={onAddWidget}
                className="flex items-center gap-2 cursor-pointer rounded-lg h-9 px-4 bg-primary hover:bg-sky-500 text-white text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                <span className="hidden sm:inline">Add Widget</span>
              </button>
              <button
                onClick={onDone}
                className="flex items-center gap-2 cursor-pointer rounded-lg h-9 px-4 bg-surface-border hover:bg-[#3b4b54] text-white text-sm font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  check
                </span>
                <span className="hidden sm:inline">Done</span>
              </button>
            </>
          ) : (
            <>
              <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-[#283339] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#344149] transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-[#283339] text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-[#344149] transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </>
          )}
        </div>

        {isEditMode && (
          <>
            <div className="w-px h-6 bg-surface-border mx-1"></div>
            <button className="text-[#9db0b9] hover:text-white transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="text-[#9db0b9] hover:text-white transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </>
        )}

        <div
          className={`size-9 md:h-10 md:w-10 rounded-full bg-cover bg-center ${
            isEditMode
              ? "border border-surface-border ml-2"
              : "ring-2 ring-white dark:ring-slate-700"
          }`}
          data-alt="User profile avatar"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDx8_hWL1Z6o2JeQgx750YZt3LugnKwyw5d8Dc7AaNkc1edLpuWulUdnlH5iWn06HsmnOP2E3j9jZ2HUi15g5diHJ00N4RvirLyDXfssqj2TKHU9IThBYQkjXyyv6XyVPcB3hXuGgZYsU1kX5_KgdjenG4gHgTXf6Qk7HcTnMe_MsibyK6emjH78RQ74LWDQDMUtr4GAb1k5rDFpvx3b3mCu0XZyaxQiqfylCF2eG9JpttVFgsMajY-m-oIGdC9eYhwuBS8cJs-NE')",
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;
