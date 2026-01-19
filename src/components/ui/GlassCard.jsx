import React from 'react';
import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl",
        hover && "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}