import * as React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  cta = "See all",
  Icon,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  Icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-white/55 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {href && (
        <Link href={href}>
          <button className="text-xs sm:text-sm text-white/70 hover:text-white inline-flex items-center gap-1 shrink-0 px-2 py-1 rounded-md hover:bg-white/5">
            {cta} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      )}
    </div>
  );
}
