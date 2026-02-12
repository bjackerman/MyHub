"use client";

import React from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";

export default function LibraryPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      <Header mode="view" />
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Main Content Area (Scrollable Canvas) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
            {/* Greeting Section */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Good Morning, Alex
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Here's your daily overview.
              </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-dense">
              {/* Large Clock Widget (Span 4) */}
              <Card className="md:col-span-4 row-span-2 flex flex-col justify-between h-80 md:h-auto !p-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-primary uppercase tracking-wider">
                    San Francisco
                  </p>
                  <h3 className="text-6xl font-bold mt-2 tracking-tighter">
                    10:42
                  </h3>
                  <p className="text-xl text-slate-400 dark:text-slate-500 mt-1">
                    AM
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-medium">Tuesday</p>
                    <p className="text-slate-500">October 24, 2023</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-yellow-500">
                    sunny
                  </span>
                </div>
              </Card>

              {/* Quick Launch Grid (Span 8) */}
              <Card
                title="Quick Launch"
                icon="rocket_launch"
                className="md:col-span-8"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      name: "Plex",
                      icon: "play_circle",
                      bg: "bg-orange-500",
                      shadow: "shadow-orange-500/20",
                    },
                    {
                      name: "GitHub",
                      icon: "code",
                      bg: "bg-slate-800",
                      shadow: "shadow-slate-800/20",
                    },
                    {
                      name: "Gmail",
                      icon: "mail",
                      bg: "bg-red-500",
                      shadow: "shadow-red-500/20",
                    },
                    {
                      name: "Spotify",
                      icon: "music_note",
                      bg: "bg-green-500",
                      shadow: "shadow-green-500/20",
                    },
                  ].map((app) => (
                    <a
                      key={app.name}
                      className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#20292e] hover:bg-slate-100 dark:hover:bg-[#283339] transition-all hover:scale-105 group/item"
                      href="#"
                    >
                      <div
                        className={`size-12 rounded-lg ${app.bg} flex items-center justify-center text-white shadow-lg ${app.shadow}`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {app.icon}
                        </span>
                      </div>
                      <span className="text-sm font-medium group-hover/item:text-primary transition-colors">
                        {app.name}
                      </span>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Photo Gallery (Span 4) */}
              <Card className="md:col-span-4 row-span-2 !p-2 h-80 md:h-auto">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700"
                    data-alt="A scenic landscape view of mountains and a lake at sunset"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAOt1j92Q1SEDLdPMdibLlErzrF5oIvazfL_IbmTb5dusZDBX92RRKjPNbFUXNQPKPVcCBpSJamTB8CC4AJtY5nak5CYIuWNN6bw63bc13PKmpNkvDpJjxEPqXrdlR0J61sjdiEV4X8eqcIQAyYcv-FJpvvSv41E1nmdgZuzfwpNCKFClchSciJg3IXI3ol7sbbZ2LOApFiGH400uXA-1rlmCdKmsZOITA0ws_qlawBUkMySaMYaD9bdnHtPHmsR0yNUiZpE5pJ6F0')",
                    }}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-medium">Yosemite Trip</p>
                    <p className="text-white/60 text-xs">2 years ago</p>
                  </div>
                </div>
              </Card>

              {/* System Stats (Span 4) */}
              <Card
                title="System Status"
                icon="memory"
                className="md:col-span-4"
              >
                <div className="space-y-4">
                  {[
                    {
                      label: "CPU Load",
                      val: "12%",
                      width: "12%",
                      color: "bg-primary",
                    },
                    {
                      label: "RAM Usage",
                      val: "4.2 GB / 16 GB",
                      width: "26%",
                      color: "bg-purple-500",
                    },
                    {
                      label: "Storage",
                      val: "1.1 TB Free",
                      width: "65%",
                      color: "bg-green-500",
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400">
                          {stat.label}
                        </span>
                        <span className="font-medium">{stat.val}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stat.color} rounded-full`}
                          style={{ width: stat.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Tasks Widget (Span 4) */}
              <Card title="Tasks" icon="check_circle" className="md:col-span-4">
                <ul className="space-y-3">
                  {[
                    { text: "Update server packages", done: true },
                    { text: "Review backup logs", done: false },
                    { text: "Configure new firewall rules", done: false },
                  ].map((task, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={task.done}
                        className="rounded border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-[#20292e] text-primary focus:ring-offset-0 focus:ring-primary/20 size-5"
                      />
                      <span
                        className={
                          task.done ? "text-slate-400 line-through" : ""
                        }
                      >
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </main>

        <Sidebar />
      </div>
    </div>
  );
}
