import { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "warning" | "danger" | "success";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
          {
            "bg-[rgba(var(--glass-tint)/0.1)] text-[rgb(var(--text-muted))] border border-[rgba(var(--glass-stroke)/0.2)]": variant === "default",
            "bg-[rgba(var(--primary)/0.15)] text-[rgb(var(--primary))] border border-[rgba(var(--primary)/0.3)]": variant === "primary",
            "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30": variant === "warning",
            "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30": variant === "danger",
            "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30": variant === "success",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
