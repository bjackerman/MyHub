"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "bot" | "user";
  content: string;
}

const AIChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hello! I can help you analyze your dashboard data or draft content. What would you like to do today?",
    },
    {
      role: "user",
      content: "Summarize the Q3 performance metrics.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `I've analyzed the metrics for Q3. Overall performance is up by 15% compared to Q2. Key drivers include increased engagement in the dashboard and higher retention rates for new widgets.`,
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 widget-scroll"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "bot"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                  : "bg-primary"
              }`}
            >
              <span className="material-symbols-outlined text-white text-[16px]">
                {msg.role === "bot" ? "smart_toy" : "person"}
              </span>
            </div>
            <div
              className={`rounded-lg p-3 max-w-[85%] ${
                msg.role === "bot"
                  ? "bg-surface-border rounded-tl-none"
                  : "bg-primary/20 text-primary-content rounded-tr-none border border-primary/30"
              }`}
            >
              <p className="text-sm text-gray-200">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
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
        )}
      </div>
      <div className="p-3 border-t border-surface-border bg-surface-dark/50">
        <div className="relative">
          <input
            className="w-full bg-background-dark border border-surface-border rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-[#586b75] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="Ask AI..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1.5 p-1 text-primary hover:bg-surface-border rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidget;
