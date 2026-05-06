export type ThemeMode = "dark" | "light";

export interface ThemePreset {
  id: ThemeMode;
  label: string;
  description: string;
  htmlClass: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "dark", label: "Night", description: "Dark navy glass UI", htmlClass: "dark" },
  { id: "light", label: "Day", description: "E-commerce white and blue UI", htmlClass: "light" },
];

export const THEME_STORAGE_KEY = "pm.theme.v1";

