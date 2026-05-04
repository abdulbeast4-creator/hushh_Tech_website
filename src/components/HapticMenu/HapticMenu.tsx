import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type HapticMenuItem = {
  id: string;
  label: string;
  description?: string;
  onSelect?: () => void;
  disabled?: boolean;
};

type HapticMenuProps = {
  items: HapticMenuItem[];
  children: React.ReactNode;
  className?: string;
};

const OFFSET = 8;

export default function HapticMenu({ items, children, className = "" }: HapticMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const menuId = useMemo(
    () => `haptic-menu-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  const closeMenu = () => setIsOpen(false);

  const openMenuAt = (x: number, y: number) => {
    setAnchor({ x, y });
    setPosition({ x, y });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();

    const clampedX = Math.min(anchor.x, window.innerWidth - rect.width - OFFSET);
    const clampedY = Math.min(anchor.y, window.innerHeight - rect.height - OFFSET);

    setPosition({
      x: Math.max(OFFSET, clampedX),
      y: Math.max(OFFSET, clampedY),
    });
  }, [anchor.x, anchor.y, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      closeMenu();
    };

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    openMenuAt(event.clientX, event.clientY);
  };

  return (
    <div className={className} onContextMenu={handleContextMenu}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="menu"
            id={menuId}
            aria-label="Context menu"
            className="ios-glass fixed z-[1200] min-w-[16rem] overflow-hidden rounded-squircle border border-ios-card bg-ios-card p-1 shadow-2xl"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: [1.05, 1], transition: { duration: 0.18 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  closeMenu();
                }}
                className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition-all duration-200 ease-ios enabled:hover:bg-ios-bg enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-sm font-semibold text-ios-text-primary">{item.label}</span>
                {item.description ? (
                  <span className="text-xs text-ios-text-secondary">{item.description}</span>
                ) : null}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
