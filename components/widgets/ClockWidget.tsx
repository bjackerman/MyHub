"use client";

import React, { useState, useEffect } from "react";

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-5xl font-bold tracking-tighter text-white/20 mb-2">
          00:00:00
        </div>
        <div className="text-[#9db0b9]/20 text-sm font-medium">
          Loading clock...
        </div>
      </div>
    );
  }

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = time.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-5xl font-bold tracking-tighter text-white mb-2">
        {timeString.split(" ")[0]}
      </div>
      <div className="text-primary font-medium uppercase tracking-widest text-xs">
        {timeString.split(" ")[1]}
      </div>
      <div className="mt-4 text-[#9db0b9] text-sm font-medium">
        {dateString}
      </div>
    </div>
  );
};

export default ClockWidget;
