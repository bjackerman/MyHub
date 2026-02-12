"use client";

import React from "react";

const WeatherWidget: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-white font-bold text-lg">London</h4>
          <p className="text-[#9db0b9] text-xs">Mostly Cloudy</p>
        </div>
        <div className="text-4xl">☁️</div>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl font-bold text-white">18°</div>
        <div className="text-[#9db0b9] text-xs leading-tight">
          H: 21°<br />
          L: 14°
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-surface-border pt-4">
        {[
          { day: "Tue", temp: "19°", icon: "⛅" },
          { day: "Wed", temp: "17°", icon: "🌧️" },
          { day: "Thu", temp: "22°", icon: "☀️" },
        ].map((d) => (
          <div key={d.day} className="flex flex-col items-center">
            <span className="text-[#9db0b9] text-[10px] uppercase">{d.day}</span>
            <span className="my-1">{d.icon}</span>
            <span className="text-white text-xs font-bold">{d.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
