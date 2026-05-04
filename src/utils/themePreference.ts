export const THEME_PREFERENCE_KEY = "theme-preference";
export const LEGACY_THEME_PREFERENCE_KEY = "hushhThemePreference";

export type ThemePreference = "dark" | "light";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "dark" || value === "light";

export const migrateLegacyThemePreference = (
  storage: StorageLike
): ThemePreference | null => {
  const legacyPreference = storage.getItem(LEGACY_THEME_PREFERENCE_KEY);
  if (!isThemePreference(legacyPreference)) return null;

  storage.setItem(THEME_PREFERENCE_KEY, legacyPreference);
  storage.removeItem(LEGACY_THEME_PREFERENCE_KEY);
  return legacyPreference;
};

export const readThemePreference = (storage: StorageLike): ThemePreference | null => {
  const storedPreference = storage.getItem(THEME_PREFERENCE_KEY);
  if (isThemePreference(storedPreference)) return storedPreference;
  return migrateLegacyThemePreference(storage);
};

export const resolveInitialDarkMode = (
  storage: StorageLike,
  rootElement: Element,
  matchMedia?: (query: string) => MediaQueryList
): boolean => {
  const storedPreference = readThemePreference(storage);
  if (storedPreference === "dark") return true;
  if (storedPreference === "light") return false;

  if (rootElement.classList.contains("dark")) return true;
  return Boolean(matchMedia?.("(prefers-color-scheme: dark)").matches);
};

export const persistThemePreference = (
  storage: StorageLike,
  isDarkMode: boolean
): ThemePreference => {
  const nextPreference: ThemePreference = isDarkMode ? "dark" : "light";
  storage.setItem(THEME_PREFERENCE_KEY, nextPreference);
  return nextPreference;
};

export const applyDarkModeClass = (rootElement: Element, isDarkMode: boolean): void => {
  rootElement.classList.toggle("dark", isDarkMode);
};
