import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white border border-red-600/30 rounded-2xl shadow-md",
        hover && "hover:border-red-600/50 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}