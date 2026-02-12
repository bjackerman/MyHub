"use client";

import React, { useState } from "react";

interface Task {
  id: number;
  text: string;
  sub: string | null;
  checked: boolean;
}

const TasksWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Review PR #402", sub: "Due Today", checked: false },
    {
      id: 2,
      text: "Update documentation for v2.0 release",
      sub: null,
      checked: false,
    },
    { id: 3, text: "Team sync at 2pm", sub: null, checked: true },
    { id: 4, text: "Fix mobile nav bug", sub: null, checked: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      { id: Date.now(), text: newTask, sub: null, checked: false },
      ...tasks,
    ]);
    setNewTask("");
  };

  return (
    <div className="flex-1 p-0 flex flex-col h-full">
      <div className="p-3 border-b border-surface-border bg-background-dark/30">
        <form onSubmit={addTask} className="flex items-center gap-2">
          <div className="text-[#9db0b9]">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </div>
          <input
            className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder-[#586b75] w-full p-0 outline-none"
            placeholder="Add a new task..."
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </form>
      </div>
      <div className="flex-1 overflow-y-auto widget-scroll p-2">
        {tasks.map((task) => (
          <label
            key={task.id}
            className={`flex items-start gap-3 p-2 rounded hover:bg-surface-border/50 cursor-pointer group/task transition-colors ${
              task.checked ? "opacity-60" : ""
            }`}
          >
            <input
              className="mt-0.5 h-4 w-4 rounded border-[#3b4b54] bg-transparent text-primary focus:ring-0 focus:ring-offset-0"
              type="checkbox"
              checked={task.checked}
              onChange={() => toggleTask(task.id)}
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
                <p className="text-[#586b75] text-xs mt-0.5">{task.sub}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TasksWidget;
