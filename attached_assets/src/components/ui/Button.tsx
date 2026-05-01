import { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "soft" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "btn",
          {
            "btn-primary": variant === "primary",
            "btn-ghost": variant === "ghost",
            "btn-soft": variant === "soft",
            "border border-[rgba(var(--glass-stroke)/0.4)] hover:bg-[rgba(var(--glass-tint)/0.1)]": variant === "outline",
            "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20": variant === "danger",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
            "p-2.5": size === "icon",
            "w-full": fullWidth,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
