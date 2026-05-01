import { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  interactive?: boolean;
  golden?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, strong, interactive, golden, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          strong ? "glass-strong rounded-2xl" : "glass-card",
          interactive && "hover-lift press cursor-pointer",
          golden && "golden-border",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
