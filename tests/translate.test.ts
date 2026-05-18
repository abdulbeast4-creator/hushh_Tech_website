import { describe, expect, it } from "vitest";
import { t } from "../src/utils/translate";

describe("t() — core translation utility", () => {
  // ─── Standard resolution ────────────────────────────────────────────────

  it("resolves a nested key in the English locale", () => {
    expect(t("navigation.home", "en")).toBe("Home");
  });

  it("resolves a nested key in the French locale", () => {
    expect(t("navigation.home", "fr")).toBe("Accueil");
  });

  it("resolves a nested key in the Chinese locale", () => {
    expect(t("navigation.home", "zh")).toBe("首页");
  });

  it("resolves a nested key in the Arabic locale", () => {
    expect(t("navigation.home", "ar")).toBe("الرئيسية");
  });

  it("resolves navigation.login for every supported locale", () => {
    expect(t("navigation.login", "en")).toBe("Log In");
    expect(t("navigation.login", "fr")).toBe("Connexion");
    expect(t("navigation.login", "zh")).toBe("登录");
    expect(t("navigation.login", "ar")).toBe("تسجيل الدخول");
  });

  it("resolves navigation.signup for every supported locale", () => {
    expect(t("navigation.signup", "en")).toBe("Sign Up");
    expect(t("navigation.signup", "fr")).toBe("S'inscrire");
    expect(t("navigation.signup", "zh")).toBe("注册");
    expect(t("navigation.signup", "ar")).toBe("إنشاء حساب");
  });

  it("resolves navigation.faq for every supported locale", () => {
    expect(t("navigation.faq", "en")).toBe("FAQ");
    expect(t("navigation.faq", "fr")).toBe("FAQ");
    expect(t("navigation.faq", "zh")).toBe("常见问题");
    expect(t("navigation.faq", "ar")).toBe("الأسئلة الشائعة");
  });

  // ─── English fallback boundary trap ─────────────────────────────────────

  it("returns the raw key string when the path is absent from all locales", () => {
    expect(t("navigation.missingKey", "en")).toBe("navigation.missingKey");
    expect(t("navigation.missingKey", "fr")).toBe("navigation.missingKey");
    expect(t("navigation.missingKey", "ar")).toBe("navigation.missingKey");
  });

  it("returns the raw key string for a completely unknown namespace", () => {
    expect(t("phantom.ghost.token", "en")).toBe("phantom.ghost.token");
    expect(t("phantom.ghost.token", "zh")).toBe("phantom.ghost.token");
  });

  it("returns the raw key when path resolves to an object node, not a leaf string", () => {
    // 'navigation' exists but is an object, not a string — must not crash
    expect(t("navigation", "en")).toBe("navigation");
    expect(t("navigation", "ar")).toBe("navigation");
  });

  // ─── RTL locale content integrity ───────────────────────────────────────

  it("Arabic unlock key contains expected Arabic numerals and text", () => {
    const result = t("navigation.unlock", "ar");
    expect(result).toContain("300");
    expect(result).toContain("عملة");
  });

  it("Arabic philosophy key is non-empty and differs from English", () => {
    const ar = t("navigation.philosophy", "ar");
    const en = t("navigation.philosophy", "en");
    expect(ar.length).toBeGreaterThan(0);
    expect(ar).not.toBe(en);
  });
});
