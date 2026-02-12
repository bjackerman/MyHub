import React from "react";

const WIDGET_CATEGORIES = [
  {
    name: "Essentials",
    widgets: [
      {
        name: "World Clock",
        icon: "schedule",
        description: "Multiple timezones",
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
      },
      {
        name: "Weather",
        icon: "cloud",
        description: "Current conditions",
        colorClass: "text-orange-500",
        bgClass: "bg-orange-500/10",
      },
    ],
  },
  {
    name: "Productivity",
    widgets: [
      {
        name: "Calendar",
        icon: "calendar_month",
        description: "Upcoming events",
        colorClass: "text-emerald-500",
        bgClass: "bg-emerald-500/10",
      },
      {
        name: "Notes",
        icon: "sticky_note_2",
        description: "Quick scratchpad",
        colorClass: "text-purple-500",
        bgClass: "bg-purple-500/10",
      },
    ],
  },
  {
    name: "Media",
    widgets: [
      {
        name: "RSS Feed",
        icon: "rss_feed",
        description: "News aggregator",
        colorClass: "text-pink-500",
        bgClass: "bg-pink-500/10",
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151b1e] flex flex-col shadow-2xl z-10 h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Widget Library
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Drag widgets to your dashboard
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {WIDGET_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
              {category.name}
            </h3>
            <div className="space-y-3">
              {category.widgets.map((widget) => (
                <div
                  key={widget.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#20292e] border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group"
                >
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center ${widget.bgClass} ${widget.colorClass}`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {widget.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                      {widget.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {widget.description}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">
                    add_circle
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a2125]">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-xl">save</span>
          Save Layout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
