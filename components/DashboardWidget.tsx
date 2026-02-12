import React from "react";

interface DashboardWidgetProps {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  x,
  y,
  width,
  height,
  isSelected = false,
  children,
  className = "",
  headerRight,
}) => {
  return (
    <div
      className={`absolute flex flex-col group z-20 bg-surface-dark rounded-xl shadow-lg ${
        isSelected ? "border-2 border-primary" : "border border-surface-border"
      } ${className}`}
      style={{
        top: y,
        left: x,
        width,
        height,
      }}
    >
      {/* Drag Handle Header */}
      <div className="h-10 border-b border-surface-border flex items-center justify-between px-3 cursor-move bg-[#202930] rounded-t-xl">
        <div className="flex items-center gap-2 text-[#9db0b9]">
          <span className="material-symbols-outlined text-[18px]">
            drag_indicator
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
          <button className="text-[#9db0b9] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">
              more_horiz
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
        {children}
      </div>

      {/* Resize Handle */}
      {isSelected && <div className="resize-handle resize-handle-se"></div>}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
          {width}x{height}
        </div>
      )}
    </div>
  );
};

export default DashboardWidget;
