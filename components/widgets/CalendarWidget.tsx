"use client";

import React from "react";

const CalendarWidget: React.FC = () => {
  return (
    <div className="flex-1 p-4 flex flex-col items-center">
      <div className="w-full mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-bold">Oct 2023</span>
          <div className="flex gap-2">
            <button className="text-[#9db0b9] hover:text-white cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">
                chevron_left
              </span>
            </button>
            <button className="text-[#9db0b9] hover:text-white cursor-pointer">
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
          {[...Array(9)].map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
          <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">
            10
          </div>
          {[...Array(11)].map((_, i) => (
            <div key={i}>{i + 11}</div>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-surface-border pt-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-1 h-8 rounded-full bg-red-500"></div>
          <div>
            <p className="text-white text-xs font-medium">Design Review</p>
            <p className="text-[#9db0b9] text-[10px]">10:00 - 11:30 AM</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1 h-8 rounded-full bg-green-500"></div>
          <div>
            <p className="text-white text-xs font-medium">Lunch with Sarah</p>
            <p className="text-[#9db0b9] text-[10px]">12:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
