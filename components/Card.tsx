import React from "react";

interface CardProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-[#192125] p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative group flex flex-col ${className}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <span className="material-symbols-outlined text-slate-400 cursor-move">
          drag_indicator
        </span>
      </div>
      {title && (
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {icon && (
            <span className="material-symbols-outlined text-primary">{icon}</span>
          )}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
