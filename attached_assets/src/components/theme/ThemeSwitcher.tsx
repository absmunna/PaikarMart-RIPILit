import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("paikarmart:theme:user", next);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--glass-tint)/0.1)] border border-[rgba(var(--glass-stroke)/0.2)] text-[rgb(var(--text))] transition-all hover:bg-[rgba(var(--glass-tint)/0.2)] active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
