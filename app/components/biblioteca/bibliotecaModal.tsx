'use client'

import React from "react";

export default function BibliotecaModal({
  open,
  children,
  onClose
}: {
  open: boolean,
  children: React.ReactNode,
  onClose: () => void
}) {
  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => {
        if(e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}