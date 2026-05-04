// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import {
  LEGACY_THEME_PREFERENCE_KEY,
  THEME_PREFERENCE_KEY,
  applyDarkModeClass,
  migrateLegacyThemePreference,
  persistThemePreference,
  readThemePreference,
  resolveInitialDarkMode,
} from "../src/utils/themePreference";

describe("themePreference", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("reads the new theme-preference key when present", () => {
    localStorage.setItem(THEME_PREFERENCE_KEY, "dark");
    expect(readThemePreference(localStorage)).toBe("dark");
  });

  it("migrates the legacy key to theme-preference", () => {
    localStorage.setItem(LEGACY_THEME_PREFERENCE_KEY, "light");

    const result = migrateLegacyThemePreference(localStorage);

    expect(result).toBe("light");
    expect(localStorage.getItem(THEME_PREFERENCE_KEY)).toBe("light");
    expect(localStorage.getItem(LEGACY_THEME_PREFERENCE_KEY)).toBeNull();
  });

  it("resolves dark mode from stored preference before other signals", () => {
    localStorage.setItem(THEME_PREFERENCE_KEY, "dark");
    const matchMedia = () => ({ matches: false } as MediaQueryList);

    const isDark = resolveInitialDarkMode(
      localStorage,
      document.documentElement,
      matchMedia
    );

    expect(isDark).toBe(true);
  });

  it("falls back to root .dark class before system preference", () => {
    document.documentElement.classList.add("dark");
    const matchMedia = () => ({ matches: false } as MediaQueryList);

    const isDark = resolveInitialDarkMode(
      localStorage,
      document.documentElement,
      matchMedia
    );

    expect(isDark).toBe(true);
  });

  it("falls back to prefers-color-scheme when no storage or root class", () => {
    const matchMediaDark = () => ({ matches: true } as MediaQueryList);
    const matchMediaLight = () => ({ matches: false } as MediaQueryList);

    expect(
      resolveInitialDarkMode(localStorage, document.documentElement, matchMediaDark)
    ).toBe(true);
    expect(
      resolveInitialDarkMode(localStorage, document.documentElement, matchMediaLight)
    ).toBe(false);
  });

  it("persists and applies dark mode state", () => {
    persistThemePreference(localStorage, true);
    applyDarkModeClass(document.documentElement, true);

    expect(localStorage.getItem(THEME_PREFERENCE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    persistThemePreference(localStorage, false);
    applyDarkModeClass(document.documentElement, false);

    expect(localStorage.getItem(THEME_PREFERENCE_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
