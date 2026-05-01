import { Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/features/theme/ThemeContext";
import type { ThemeMode } from "@/config/theme.config";

const ICONS: Record<ThemeMode, React.ComponentType<{ className?: string }>> = {
  dark: Moon,
  light: Sun,
};

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, presets } = useTheme();
  const Icon = ICONS[mode] ?? Moon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme" className="text-foreground hover:bg-white/10">
          <Icon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {(Array.isArray(presets) ? presets : []).map((p) => {
          const I = ICONS[p.id] ?? Moon;
          return (
            <DropdownMenuItem key={p.id} onClick={() => setMode(p.id)} className="gap-2">
              <I className="h-4 w-4" />
              <div className="flex-1">
                <div className="text-sm font-medium">{p.label}</div>
                {!compact && <div className="text-xs text-muted-foreground">{p.description}</div>}
              </div>
              {mode === p.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
