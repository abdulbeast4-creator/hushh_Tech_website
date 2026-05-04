// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      (props, ref) => <div ref={ref} {...props} />
    ),
  },
}));

import HapticMenu from "../src/components/HapticMenu/HapticMenu";

describe("HapticMenu", () => {
  let container: HTMLDivElement;
  let root: Root;

  const items = [
    { id: "copy", label: "Copy", description: "Copy to clipboard" },
    { id: "delete", label: "Delete", description: "Remove this item" },
  ];

  const renderMenu = async () => {
    await act(async () => {
      root.render(
        <HapticMenu items={items}>
          <div data-testid="trigger">Right click me</div>
        </HapticMenu>
      );
    });
  };

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it("opens on right-click (contextmenu)", async () => {
    await renderMenu();
    const trigger = container.querySelector('[data-testid="trigger"]');
    if (!trigger) throw new Error("Trigger was not rendered");

    expect(container.querySelector('[role="menu"]')).toBeNull();

    await act(async () => {
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 120,
          clientY: 140,
        })
      );
    });

    const menu = container.querySelector('[role="menu"]');
    const menuItems = container.querySelectorAll('[role="menuitem"]');

    expect(menu).toBeTruthy();
    expect(menuItems.length).toBe(2);
    expect(container.textContent).toContain("Copy");
    expect(container.textContent).toContain("Copy to clipboard");
  });

  it("calls the provided onSelect callback when an option is clicked", async () => {
    const onCopy = vi.fn();
    const onDelete = vi.fn();
    const itemsWithHandlers = [
      { id: "copy", label: "Copy", description: "Copy to clipboard", onSelect: onCopy },
      { id: "delete", label: "Delete", description: "Remove this item", onSelect: onDelete },
    ];

    await act(async () => {
      root.render(
        <HapticMenu items={itemsWithHandlers}>
          <div data-testid="trigger">Right click me</div>
        </HapticMenu>
      );
    });

    const trigger = container.querySelector('[data-testid="trigger"]');
    if (!trigger) throw new Error("Trigger was not rendered");

    await act(async () => {
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 120,
          clientY: 140,
        })
      );
    });

    const menuItems = container.querySelectorAll('[role="menuitem"]');
    expect(menuItems.length).toBe(2);

    const copyButton = menuItems[0];
    if (!(copyButton instanceof HTMLButtonElement)) throw new Error("Expected menuitem button");

    await act(async () => {
      copyButton.click();
    });

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });

  it("repositions menu near viewport edges to avoid overflow", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 300 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 200 });

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => {
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        width: 200,
        height: 120,
        right: 200,
        bottom: 120,
        toJSON: () => ({}),
      } as DOMRect;
    });

    await renderMenu();
    const trigger = container.querySelector('[data-testid="trigger"]');
    if (!trigger) throw new Error("Trigger was not rendered");

    await act(async () => {
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 290,
          clientY: 190,
        })
      );
    });

    const menu = container.querySelector('[role="menu"]') as HTMLDivElement | null;
    if (!menu) throw new Error("Menu did not render");

    expect(menu.style.left).toBe("92px");
    expect(menu.style.top).toBe("72px");
  });

  it("closes when Escape is pressed", async () => {
    await renderMenu();
    const trigger = container.querySelector('[data-testid="trigger"]');
    if (!trigger) throw new Error("Trigger was not rendered");

    await act(async () => {
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 120,
          clientY: 140,
        })
      );
    });

    expect(container.querySelector('[role="menu"]')).toBeTruthy();

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(container.querySelector('[role="menu"]')).toBeNull();
  });
});
