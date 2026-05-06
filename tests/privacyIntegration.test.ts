// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import DataVitalTracker from "../src/components/dashboard/DataVitalTracker";
import {
  PrivacySettingsProvider,
  usePrivacySettingsContext,
} from "../src/context/PrivacySettingsContext";

function PrivacyHarness() {
  const { isPrivacyModeEnabled, setIsPrivacyModeEnabled } = usePrivacySettingsContext();

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("button", {
      type: "button",
      "data-testid": "toggle-privacy",
      onClick: () => setIsPrivacyModeEnabled((prev) => !prev),
    }, "Toggle"),
    React.createElement(
      "span",
      { "data-testid": "privacy-state" },
      isPrivacyModeEnabled ? "on" : "off"
    ),
    React.createElement(DataVitalTracker, {
      userMetrics: { height: 165, weight: 76, unit: "metric" as const },
      isPrivacyModeEnabled,
    })
  );
}

describe("privacy settings integration", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it("hydrates persisted privacy mode from localStorage", async () => {
    localStorage.setItem("hushh-privacy-mode", "true");

    await act(async () => {
      root.render(
        React.createElement(
          PrivacySettingsProvider,
          null,
          React.createElement(PrivacyHarness)
        )
      );
    });

    expect(container.querySelector('[data-testid="privacy-state"]')?.textContent).toBe("on");
    const heightValue = Array.from(container.querySelectorAll("p")).find((node) =>
      node.textContent?.includes("165 cm")
    ) as HTMLParagraphElement | undefined;
    expect(heightValue?.style.filter).toBe("blur(8px)");
  });

  it("propagates toggle changes to DataVitalTracker blur state", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          PrivacySettingsProvider,
          null,
          React.createElement(PrivacyHarness)
        )
      );
    });

    const heightValueBefore = Array.from(container.querySelectorAll("p")).find((node) =>
      node.textContent?.includes("165 cm")
    ) as HTMLParagraphElement | undefined;
    expect(heightValueBefore?.style.filter ?? "").toBe("");

    const toggleButton = container.querySelector(
      '[data-testid="toggle-privacy"]'
    ) as HTMLButtonElement | null;
    if (!toggleButton) throw new Error("Toggle button not found");

    await act(async () => {
      toggleButton.click();
    });

    expect(container.querySelector('[data-testid="privacy-state"]')?.textContent).toBe("on");
    expect(localStorage.getItem("hushh-privacy-mode")).toBe("true");

    const heightValueAfter = Array.from(container.querySelectorAll("p")).find((node) =>
      node.textContent?.includes("165 cm")
    ) as HTMLParagraphElement | undefined;
    expect(heightValueAfter?.style.filter).toBe("blur(8px)");
  });
});
