import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl",
        hover && "hover:bg-red-500/5 hover:border-red-500/30 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}