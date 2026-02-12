import React, { useState, useRef, useEffect } from "react";

interface DashboardWidgetProps {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  isLocked?: boolean;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
  onMove?: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
  onToggleLock?: (id: string) => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  x,
  y,
  width,
  height,
  isSelected = false,
  isLocked = false,
  children,
  className = "",
  headerRight,
  onMove,
  onResize,
  onSelect,
  onRemove,
  onToggleLock,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialWidgetPos = useRef({ x: 0, y: 0 });
  const initialWidgetSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    onSelect?.(id);
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialWidgetPos.current = { x, y };
    e.stopPropagation();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    setIsResizing(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialWidgetSize.current = { width, height };
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        onMove?.(id, initialWidgetPos.current.x + dx, initialWidgetPos.current.y + dy);
      } else if (isResizing) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        onResize?.(
          id,
          Math.max(200, initialWidgetSize.current.width + dx),
          Math.max(150, initialWidgetSize.current.height + dy)
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, id, onMove, onResize]);

  return (
    <div
      className={`absolute flex flex-col group z-20 bg-surface-dark rounded-xl shadow-lg transition-shadow ${
        isSelected ? "border-2 border-primary ring-4 ring-primary/10 shadow-2xl z-30" : "border border-surface-border"
      } ${isDragging ? "opacity-90 cursor-grabbing" : ""} ${className}`}
      style={{
        top: y,
        left: x,
        width,
        height,
      }}
      onClick={(e) => {
        onSelect?.(id);
        e.stopPropagation();
      }}
    >
      {/* Drag Handle Header */}
      <div
        className={`h-10 border-b border-surface-border flex items-center justify-between px-3 bg-[#202930] rounded-t-xl select-none ${isLocked ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-[#9db0b9]">
          <span className="material-symbols-outlined text-[18px]">
            {isLocked ? "lock" : "drag_indicator"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          {headerRight}
          <button 
            className={`transition-colors cursor-pointer flex items-center ${isLocked ? "text-orange-500" : "text-[#9db0b9] hover:text-white"}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock?.(id);
            }}
            title={isLocked ? "Unlock Widget" : "Lock Widget"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isLocked ? "lock" : "lock_open"}
            </span>
          </button>
          <button 
            className="text-[#9db0b9] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">
              more_horiz
            </span>
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              ></div>
              <div className="absolute right-0 top-full mt-1 w-32 bg-[#283339] border border-surface-border rounded shadow-xl z-50 overflow-hidden">
                <button 
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 flex items-center gap-2 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(id);
                    setShowMenu(false);
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative min-h-0 overflow-hidden">
        {children}
      </div>

      {/* Resize Handle */}
      {(!isLocked && (isSelected || isResizing)) && (
        <div
          className="absolute bottom-0 right-0 size-6 cursor-nwse-resize flex items-end justify-end p-1 z-40"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="size-2 border-r-2 border-b-2 border-[#586b75] rounded-br-sm"></div>
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-50">
          {Math.round(width)}x{Math.round(height)}
        </div>
      )}
    </div>
  );
};

export default DashboardWidget;
