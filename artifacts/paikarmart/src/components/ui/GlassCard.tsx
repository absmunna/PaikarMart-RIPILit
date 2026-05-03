import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card rounded-xl transition-all duration-300",
          hoverEffect && "hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
