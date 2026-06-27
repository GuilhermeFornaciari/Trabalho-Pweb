'use client'

import React from "react";

export default function BibliotecaModal({
  open,
  children
}: {
  open: boolean,
  children: React.ReactNode
}) {

  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {children}
    </div>
  );
}