import React from 'react';
import { cn } from "@/lib/utils";

export default function GradientText({ children, className, variant = "primary" }) {
  const gradients = {
    primary: "from-blue-400 via-cyan-400 to-emerald-400",
    gold: "from-amber-400 via-yellow-400 to-orange-400",
    purple: "from-purple-400 via-pink-400 to-rose-400"
  };

  return (
    <span className={cn(
      "bg-gradient-to-r bg-clip-text text-transparent",
      gradients[variant],
      className
    )}>
      {children}
    </span>
  );
}