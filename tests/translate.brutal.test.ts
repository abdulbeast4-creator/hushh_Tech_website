import { describe, expect, it } from "vitest";
import { t } from "../src/utils/translate";

// ─── Diagnostic 2: Broken Key Fallback Stress Test ─────────────────────────
// Mirrors the exact key the host specified in the test spec.
// The UI must never crash — it must render the raw key string as a safe label.

describe("t() — brutal edge case diagnostics", () => {
  it("host spec key: navigation.thisKeyDoesNotExistAbsoluteFake returns raw key in en", () => {
    expect(t("navigation.thisKeyDoesNotExistAbsoluteFake", "en"))
      .toBe("navigation.thisKeyDoesNotExistAbsoluteFake");
  });

  it("host spec key: navigation.thisKeyDoesNotExistAbsoluteFake returns raw key in ar", () => {
    expect(t("navigation.thisKeyDoesNotExistAbsoluteFake", "ar"))
      .toBe("navigation.thisKeyDoesNotExistAbsoluteFake");
  });

  it("host spec key: navigation.thisKeyDoesNotExistAbsoluteFake returns raw key in fr", () => {
    expect(t("navigation.thisKeyDoesNotExistAbsoluteFake", "fr"))
      .toBe("navigation.thisKeyDoesNotExistAbsoluteFake");
  });

  it("host spec key: navigation.thisKeyDoesNotExistAbsoluteFake returns raw key in zh", () => {
    expect(t("navigation.thisKeyDoesNotExistAbsoluteFake", "zh"))
      .toBe("navigation.thisKeyDoesNotExistAbsoluteFake");
  });

  // ─── Deep phantom namespaces ──────────────────────────────────────────────

  it("deep phantom path returns raw key, never throws or returns undefined", () => {
    const result = t("deeply.nested.phantom.ghost.key", "zh");
    expect(result).toBe("deeply.nested.phantom.ghost.key");
    expect(result).not.toBeUndefined();
  });

  it("single-word phantom namespace returns raw key", () => {
    expect(t("ghost", "en")).toBe("ghost");
    expect(t("ghost", "ar")).toBe("ghost");
  });

  // ─── Object node (non-leaf) path — must NOT return [object Object] ────────

  it("path resolving to an object node never leaks [object Object] into the UI", () => {
    const result = t("navigation", "en");
    expect(result).not.toContain("[object");
    expect(result).toBe("navigation"); // returns key itself as safe label
  });

  it("object node path is safe across all locales", () => {
    for (const lang of ["en", "fr", "zh", "ar"] as const) {
      const result = t("navigation", lang);
      expect(result).not.toContain("[object");
      expect(result).toBe("navigation");
    }
  });

  // ─── Empty string key ─────────────────────────────────────────────────────

  it("empty string key returns the empty string safely without crashing", () => {
    const result = t("", "en");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  // ─── Typos in real namespaces ─────────────────────────────────────────────

  it("typo in a real key segment returns raw key, not a crash", () => {
    expect(t("navigation.typoKey", "ar")).toBe("navigation.typoKey");
    expect(t("navigaton.home", "fr")).toBe("navigaton.home"); // missing 'i'
  });

  // ─── Valid keys still resolve correctly after all edge cases ─────────────

  it("valid keys remain unaffected after edge case calls", () => {
    expect(t("navigation.home", "ar")).toBe("الرئيسية");
    expect(t("navigation.signup", "fr")).toBe("S'inscrire");
    expect(t("navigation.login", "zh")).toBe("登录");
    expect(t("navigation.faq", "en")).toBe("FAQ");
  });
});
