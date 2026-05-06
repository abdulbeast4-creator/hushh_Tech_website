import React, { useMemo } from "react";
import { motion } from "framer-motion";

type UserMetrics = {
  height: number | null;
  weight: number | null;
  unit: "metric" | "imperial";
};

interface DataVitalTrackerProps {
  userMetrics: UserMetrics;
  isPrivacyModeEnabled: boolean;
}

export default function DataVitalTracker({
  userMetrics,
  isPrivacyModeEnabled,
}: DataVitalTrackerProps) {
  const isLiveSync = useMemo(() => {
    return userMetrics.height !== null && userMetrics.weight !== null;
  }, [userMetrics.height, userMetrics.weight]);

  const metricBlurStyle = isPrivacyModeEnabled
    ? { filter: "blur(8px)", userSelect: "none" as const }
    : undefined;

  return (
    <section
      className="rounded-2xl border p-4"
      style={{
        background: "var(--ios-card)",
        borderColor: "var(--ios-glass)",
        color: "var(--ios-text-primary)",
      }}
      aria-label="Data Vital Tracker"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Data Vital Tracker</h3>
        <div className="flex items-center gap-2">
          <motion.span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: "var(--ios-text-primary)",
              boxShadow: "0 0 0 6px var(--ios-glass)",
            }}
            animate={isLiveSync ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : { opacity: 0.5 }}
            transition={{ duration: 1.2, repeat: isLiveSync ? Infinity : 0 }}
          />
          <span className="text-xs font-medium">{isLiveSync ? "Live Sync" : "Offline"}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: "var(--ios-glass)", backdropFilter: isPrivacyModeEnabled ? "blur(8px)" : "none" }}
          title={isPrivacyModeEnabled ? "Private" : undefined}
        >
          <p className="text-xs uppercase tracking-wide">Height</p>
          <p className="mt-1 text-lg font-semibold" style={metricBlurStyle}>
            {userMetrics.height ?? "--"} {userMetrics.unit === "metric" ? "cm" : "in"}
          </p>
        </div>
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: "var(--ios-glass)", backdropFilter: isPrivacyModeEnabled ? "blur(8px)" : "none" }}
          title={isPrivacyModeEnabled ? "Private" : undefined}
        >
          <p className="text-xs uppercase tracking-wide">Weight</p>
          <p className="mt-1 text-lg font-semibold" style={metricBlurStyle}>
            {userMetrics.weight ?? "--"} {userMetrics.unit === "metric" ? "kg" : "lb"}
          </p>
        </div>
      </div>
    </section>
  );
}
