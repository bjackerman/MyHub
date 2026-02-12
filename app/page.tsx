"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import DashboardWidget from "@/components/DashboardWidget";
import NotesWidget from "@/components/widgets/NotesWidget";
import BookmarksWidget from "@/components/widgets/BookmarksWidget";
import TasksWidget from "@/components/widgets/TasksWidget";
import AIChatWidget from "@/components/widgets/AIChatWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";

import ClockWidget from "@/components/widgets/ClockWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";

interface WidgetData {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  isLocked?: boolean;
  headerRight?: React.ReactNode;
}

export default function Home() {
  const [widgets, setWidgets] = useState<WidgetData[]>([
    { id: "notes", title: "Quick Notes", x: 0, y: 0, width: 300, height: 320, type: "notes", isLocked: false },
    { id: "bookmarks", title: "Bookmarks", x: 320, y: 0, width: 280, height: 320, type: "bookmarks", isLocked: false },
    { id: "clock", title: "World Clock", x: 620, y: 0, width: 280, height: 200, type: "clock", isLocked: false },
    { id: "tasks", title: "Tasks", x: 0, y: 340, width: 300, height: 360, type: "tasks", isLocked: false },
    { 
      id: "ai", 
      title: "AI Assistant", 
      x: 320, 
      y: 340, 
      width: 580, 
      height: 360, 
      type: "ai",
      isLocked: false,
      headerRight: <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">GPT-4</span>
    },
    { id: "calendar", title: "Schedule", x: 920, y: 340, width: 280, height: 360, type: "calendar", isLocked: false },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving...">("Saved");

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-layout");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = parsed.map((w: WidgetData) => {
          if (w.id === "ai") return { ...w, headerRight: <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">GPT-4</span> };
          return w;
        });
        setWidgets(merged);
      } catch (e) {
        console.error("Failed to load layout", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isLoaded) {
      setSaveStatus("Saving...");
      const toSave = widgets.map(({ headerRight, ...rest }) => rest);
      localStorage.setItem("dashboard-layout", JSON.stringify(toSave));
      const timer = setTimeout(() => setSaveStatus("Saved"), 1000);
      return () => clearTimeout(timer);
    }
  }, [widgets, isLoaded]);

  const handleMove = (id: string, x: number, y: number) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id && !w.isLocked ? { ...w, x, y } : w))
    );
  };

  const handleResize = (id: string, width: number, height: number) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id && !w.isLocked ? { ...w, width, height } : w))
    );
  };

  const toggleWidgetLock = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isLocked: !w.isLocked } : w))
    );
  };

  const addNewWidget = (type: string, title: string) => {
    const id = `${type}-${Date.now()}`;
    const newWidget: WidgetData = {
      id,
      title,
      x: 50 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      width: 300,
      height: 300,
      type,
      isLocked: false
    };
    
    // Default sizes for specific types
    if (type === "clock") { newWidget.width = 280; newWidget.height = 200; }
    if (type === "ai") { newWidget.width = 580; newWidget.height = 360; }
    
    setWidgets([...widgets, newWidget]);
    setSelectedId(id);
    setShowAddMenu(false);
  };

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const renderWidgetContent = (widget: WidgetData) => {
    switch (widget.type.split("-")[0]) {
      case "notes": return <NotesWidget />;
      case "bookmarks": return <BookmarksWidget isLocked={widget.isLocked} />;
      case "tasks": return <TasksWidget />;
      case "ai": return <AIChatWidget />;
      case "calendar": return <CalendarWidget />;
      case "clock": return <ClockWidget />;
      case "weather": return <WeatherWidget />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      <Header
        mode="edit"
        onAddWidget={() => setShowAddMenu(!showAddMenu)}
        onDone={() => setSelectedId(null)}
      />

      {/* Main Workspace (Grid Canvas) */}
      <main 
        className="flex-1 overflow-auto relative grid-background p-6"
        onClick={() => {
          setSelectedId(null);
          setShowAddMenu(false);
        }}
      >
        {/* Workspace Title */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Workspace</h1>
            <p className="text-[#9db0b9] text-sm">
              Drag widgets to rearrange. Unlock specific widgets to move/resize them.
            </p>
            <Link
              href="/config"
              className="inline-flex mt-2 text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30"
            >
              Open YAML Config Editor
            </Link>
          </div>
          <div className="flex items-center gap-2 text-[#9db0b9] text-sm">
            <span className={`w-2 h-2 rounded-full ${saveStatus === "Saved" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}></span>
            {saveStatus}
          </div>
        </div>

        {/* Grid Layout Container */}
        <div className="relative w-full h-full min-w-[1200px] min-h-[800px] mx-auto pb-20">
          {widgets.map((widget) => (
            <DashboardWidget
              key={widget.id}
              {...widget}
              isSelected={selectedId === widget.id}
              onMove={handleMove}
              onResize={handleResize}
              onSelect={(id) => setSelectedId(id)}
              onRemove={removeWidget}
              onToggleLock={toggleWidgetLock}
            >
              {renderWidgetContent(widget)}
            </DashboardWidget>
          ))}
        </div>

        {/* Widget Drawer Overlay */}
        {showAddMenu && (
          <div 
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex justify-end"
            onClick={() => setShowAddMenu(false)}
          >
            <div 
              className="w-80 bg-surface-dark border-l border-surface-border shadow-2xl h-full p-6 animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-bold text-xl">Add Widget</h3>
                <button 
                  onClick={() => setShowAddMenu(false)}
                  className="text-[#9db0b9] hover:text-white cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 widget-scroll">
                {[
                  { type: "notes", name: "Quick Notes", icon: "sticky_note_2", color: "text-purple-500", bg: "bg-purple-500/10" },
                  { type: "tasks", name: "Tasks", icon: "check_circle", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { type: "ai", name: "AI Assistant", icon: "smart_toy", color: "text-indigo-500", bg: "bg-indigo-500/10" },
                  { type: "clock", name: "World Clock", icon: "schedule", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { type: "weather", name: "Weather", icon: "cloud", color: "text-orange-500", bg: "bg-orange-500/10" },
                  { type: "calendar", name: "Schedule", icon: "calendar_month", color: "text-pink-500", bg: "bg-pink-500/10" },
                  { type: "bookmarks", name: "Bookmarks", icon: "bookmark", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addNewWidget(item.type, item.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-background-dark border border-surface-border hover:border-primary hover:bg-background-dark/80 transition-all cursor-pointer group text-left"
                  >
                    <div className={`size-12 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <span className="block text-white font-bold text-sm">{item.name}</span>
                      <span className="block text-xs text-[#9db0b9]">Add to workspace</span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
