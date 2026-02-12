"use client";

import React, { useState } from "react";

const NotesWidget: React.FC = () => {
  const [notes, setNotes] = useState(`Meeting notes:
- Discuss Q4 roadmap
- Review new design system
- Team sync at 3 PM

Action items:
[ ] Update Figma components
[ ] Send email to client`);

  return (
    <div className="flex-1 p-4 flex flex-col relative h-full">
      <div className="text-[#9db0b9] text-xs mb-2">
        Last edited just now
      </div>
      <textarea
        className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-white p-0 text-sm leading-relaxed outline-none"
        placeholder="Type your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
    </div>
  );
};

export default NotesWidget;
