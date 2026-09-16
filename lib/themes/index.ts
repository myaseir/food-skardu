import type { RestaurantTheme } from "./types";
import defaultTheme from "./default";
import theme1 from "./theme1";

const themes: Record<string, RestaurantTheme> = {
  default: defaultTheme,
  theme1,
  // theme2, theme3, ... added here as you create them
};

export function getTheme(themeKey?: string): RestaurantTheme {
  if (!themeKey) return themes.default;
  return themes[themeKey] ?? themes.default;
}