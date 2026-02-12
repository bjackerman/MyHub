"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import DashboardWidget from "@/components/DashboardWidget";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      <Header
        mode="edit"
        onAddWidget={() => console.log("Add Widget")}
        onDone={() => console.log("Done")}
      />

      {/* Main Workspace (Grid Canvas) */}
      <main className="flex-1 overflow-hidden relative grid-background p-6">
        {/* Workspace Title */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Workspace</h1>
            <p className="text-[#9db0b9] text-sm">
              Drag widgets to rearrange. Resize using the bottom-right corner.
            </p>
            <Link
              href="/config"
              className="inline-flex mt-2 text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30"
            >
              Open YAML Config Editor
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[#9db0b9] text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Auto-saving...
          </div>
        </div>

        {/* Grid Layout Container */}
        <div className="relative w-full h-full max-w-[1600px] mx-auto pb-20">
          {/* Widget 1: Notes (Resizing) */}
          <DashboardWidget
            title="Quick Notes"
            x={0}
            y={0}
            width={300}
            height={320}
            isSelected={true}
          >
            <div className="flex-1 p-4 flex flex-col relative h-full">
              <div className="text-[#9db0b9] text-xs mb-2">
                Last edited just now
              </div>
              <textarea
                className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-white p-0 text-sm leading-relaxed outline-none"
                placeholder="Type your notes here..."
                defaultValue={`Meeting notes:
- Discuss Q4 roadmap
- Review new design system
- Team sync at 3 PM

Action items:
[ ] Update Figma components
[ ] Send email to client`}
              ></textarea>
            </div>
          </DashboardWidget>

          {/* Widget 2: Bookmarks */}
          <DashboardWidget
            title="Bookmarks"
            x={320}
            y={0}
            width={280}
            height={320}
          >
            <div className="flex-1 p-2 widget-scroll overflow-y-auto">
              <div className="flex flex-col gap-1">
                {[
                  {
                    name: "GitHub Repo",
                    url: "github.com/project",
                    icon: "code",
                    color: "orange-500",
                    bg: "bg-orange-500/20",
                  },
                  {
                    name: "Vercel Dashboard",
                    url: "vercel.com/dashboard",
                    icon: "cloud",
                    color: "blue-500",
                    bg: "bg-blue-500/20",
                  },
                  {
                    name: "Figma Design",
                    url: "figma.com/file/...",
                    icon: "palette",
                    color: "purple-500",
                    bg: "bg-purple-500/20",
                  },
                ].map((item) => (
                  <a
                    key={item.name}
                    className="flex items-center gap-3 p-2 rounded hover:bg-surface-border group/item transition-colors"
                    href="#"
                  >
                    <div
                      className={`size-8 rounded ${item.bg} text-${item.color} flex items-center justify-center`}
                      style={{ color: item.color }} // Fallback
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-white text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-[#9db0b9] text-xs truncate">
                        {item.url}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#9db0b9] opacity-0 group-hover/item:opacity-100">
                      open_in_new
                    </span>
                  </a>
                ))}
                <div className="mt-2 border-t border-surface-border pt-2 px-2">
                  <button className="w-full py-1.5 text-xs text-primary font-medium hover:bg-primary/10 rounded flex items-center justify-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[14px]">
                      add
                    </span>{" "}
                    Add Bookmark
                  </button>
                </div>
              </div>
            </div>
          </DashboardWidget>

          {/* Widget 3: To-Do List */}
          <DashboardWidget
            title="Tasks"
            x={0}
            y={340}
            width={300}
            height={360}
          >
            <div className="flex-1 p-0 flex flex-col h-full">
              <div className="p-3 border-b border-surface-border bg-background-dark/30">
                <div className="flex items-center gap-2">
                  <div className="text-[#9db0b9]">
                    <span className="material-symbols-outlined text-[20px]">
                      add
                    </span>
                  </div>
                  <input
                    className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder-[#586b75] w-full p-0 outline-none"
                    placeholder="Add a new task..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto widget-scroll p-2">
                {[
                  { text: "Review PR #402", sub: "Due Today", checked: false },
                  {
                    text: "Update documentation for v2.0 release",
                    sub: null,
                    checked: false,
                  },
                  {
                    text: "Team sync at 2pm",
                    sub: null,
                    checked: true,
                    opacity: true,
                  },
                  {
                    text: "Fix mobile nav bug",
                    sub: null,
                    checked: true,
                    opacity: true,
                  },
                ].map((task, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-2 rounded hover:bg-surface-border/50 cursor-pointer group/task transition-colors ${
                      task.opacity ? "opacity-60" : ""
                    }`}
                  >
                    <input
                      className="mt-0.5 h-4 w-4 rounded border-[#3b4b54] bg-transparent text-primary focus:ring-0 focus:ring-offset-0"
                      type="checkbox"
                      defaultChecked={task.checked}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-white text-sm leading-snug group-hover/task:text-primary transition-colors ${
                          task.checked ? "text-[#9db0b9] line-through" : ""
                        }`}
                      >
                        {task.text}
                      </p>
                      {task.sub && (
                        <p className="text-[#586b75] text-xs mt-0.5">
                          {task.sub}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </DashboardWidget>

          {/* Ghost Preview */}
          <div className="absolute top-0 left-[620px] w-[580px] h-[320px] ghost-preview rounded-xl flex items-center justify-center animate-pulse z-0">
            <span className="text-primary text-sm font-medium bg-background-dark/80 px-3 py-1 rounded">
              Drop 'Analytics' Here
            </span>
          </div>

          {/* Widget 5: AI Chat */}
          <DashboardWidget
            title="AI Assistant"
            x={320}
            y={340}
            width={580}
            height={360}
            headerRight={
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                GPT-4
              </span>
            }
          >
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 widget-scroll">
                {/* Bot Message */}
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[16px]">
                      smart_toy
                    </span>
                  </div>
                  <div className="bg-surface-border rounded-lg rounded-tl-none p-3 max-w-[85%]">
                    <p className="text-sm text-gray-200">
                      Hello! I can help you analyze your dashboard data or draft
                      content. What would you like to do today?
                    </p>
                  </div>
                </div>
                {/* User Message */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[16px]">
                      person
                    </span>
                  </div>
                  <div className="bg-primary/20 text-primary-content rounded-lg rounded-tr-none p-3 max-w-[85%] border border-primary/30">
                    <p className="text-sm text-white">
                      Summarize the Q3 performance metrics.
                    </p>
                  </div>
                </div>
                {/* Bot Message (Loading) */}
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[16px]">
                      smart_toy
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
              {/* Input Area */}
              <div className="p-3 border-t border-surface-border bg-surface-dark/50">
                <div className="relative">
                  <input
                    className="w-full bg-background-dark border border-surface-border rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-[#586b75] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Ask AI..."
                    type="text"
                  />
                  <button className="absolute right-2 top-1.5 p-1 text-primary hover:bg-surface-border rounded-full transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">
                      send
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </DashboardWidget>

          {/* Widget 6: Calendar (Bottom Right) */}
          <DashboardWidget
            title="Schedule"
            x={920}
            y={340}
            width={280}
            height={360}
          >
            <div className="flex-1 p-4 flex flex-col items-center">
              <div className="w-full mb-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-bold">Oct 2023</span>
                  <div className="flex gap-2">
                    <button className="text-[#9db0b9] hover:text-white">
                      <span className="material-symbols-outlined text-[16px]">
                        chevron_left
                      </span>
                    </button>
                    <button className="text-[#9db0b9] hover:text-white">
                      <span className="material-symbols-outlined text-[16px]">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#9db0b9] mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-white">
                  <div className="text-[#586b75]">29</div>
                  <div className="text-[#586b75]">30</div>
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                  <div>9</div>
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">
                    10
                  </div>
                  <div>11</div>
                  <div>12</div>
                  <div>13</div>
                  <div>14</div>
                  <div>15</div>
                  <div>16</div>
                  <div>17</div>
                  <div>18</div>
                  <div>19</div>
                </div>
              </div>
              <div className="w-full border-t border-surface-border pt-3">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-1 h-8 rounded-full bg-red-500"></div>
                  <div>
                    <p className="text-white text-xs font-medium">
                      Design Review
                    </p>
                    <p className="text-[#9db0b9] text-[10px]">
                      10:00 - 11:30 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-8 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-white text-xs font-medium">
                      Lunch with Sarah
                    </p>
                    <p className="text-[#9db0b9] text-[10px]">12:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* Floating Action / Widget Drawer Overlay (Conceptual) */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end pointer-events-none">
          <div className="bg-surface-dark border border-surface-border p-4 rounded-xl shadow-2xl pointer-events-auto w-72 transform translate-y-2 opacity-95">
            <h3 className="text-white font-bold text-sm mb-3">Add Widget</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Analytics", icon: "bar_chart", color: "text-primary" },
                {
                  name: "Spotify",
                  icon: "music_note",
                  color: "text-green-500",
                },
                {
                  name: "Clock",
                  icon: "schedule",
                  color: "text-orange-500",
                },
                {
                  name: "Gallery",
                  icon: "image",
                  color: "text-purple-500",
                },
              ].map((item) => (
                <button
                  key={item.name}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background-dark border border-surface-border hover:border-primary hover:bg-background-dark/80 transition-all cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined ${item.color} text-2xl`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-xs text-[#9db0b9]">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
