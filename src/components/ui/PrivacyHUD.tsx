import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type PrivacyTier = {
  label: string;
  toneVar: string;
};

const tiers: PrivacyTier[] = [
  { label: "Local Vault", toneVar: "--hud-local" },
  { label: "End-to-End Encryption", toneVar: "--hud-encrypted" },
  { label: "Zero-Knowledge Link", toneVar: "--hud-shared" },
];

export default function PrivacyHUD() {
  return (
    <aside
      className="hidden md:block rounded-2xl border px-4 py-3 backdrop-blur-xl"
      style={
        {
          background: "var(--ios-glass)",
          borderColor: "var(--ios-card)",
          color: "var(--ios-text-primary)",
          "--hud-local": "#22c55e",
          "--hud-encrypted": "#3b82f6",
          "--hud-shared": "#a855f7",
        } as CSSProperties
      }
      aria-label="Privacy status HUD"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
        Privacy HUD
      </p>
      <div className="space-y-2">
        {tiers.map((tier) => (
          <div key={tier.label} className="flex items-center gap-2">
            <motion.span
              className="inline-flex h-2.5 w-2.5 rounded-full"
              style={{
                background: `var(${tier.toneVar})`,
                boxShadow: `0 0 0 0 var(${tier.toneVar})`,
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.18, 1],
                boxShadow: [
                  `0 0 0 0 var(${tier.toneVar})`,
                  `0 0 0 8px color-mix(in srgb, var(${tier.toneVar}) 30%, transparent)`,
                  `0 0 0 0 var(${tier.toneVar})`,
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <span className="text-xs font-medium">{tier.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
