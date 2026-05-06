import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

type UserMetrics = {
  height: number | null;
  weight: number | null;
  unit: "metric" | "imperial";
};

type DataVitalTrackerProps = {
  userMetrics: UserMetrics;
};

function DataVitalTracker({ userMetrics }: DataVitalTrackerProps) {
  const hasLiveMetrics = useMemo(() => {
    return (
      typeof userMetrics.height === "number" &&
      Number.isFinite(userMetrics.height) &&
      typeof userMetrics.weight === "number" &&
      Number.isFinite(userMetrics.weight)
    );
  }, [userMetrics.height, userMetrics.weight]);

  const signalLabel = hasLiveMetrics ? "Live Sync" : "Awaiting sync";
  const signalStrength = hasLiveMetrics ? 100 : 0;

  return (
    <section
      className="w-full rounded-3xl border p-6 shadow-xl"
      style={{
        background: "var(--ios-background)",
        borderColor: "var(--ios-glass)",
      }}
      aria-label="Data vital tracker"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold" style={{ color: "var(--ios-text-primary)" }}>
          Data Vital Tracker
        </h2>
        <div className="flex items-center gap-2">
          <motion.span
            className="inline-flex h-3 w-3 rounded-full"
            style={{
              background: "var(--ios-text-primary)",
              boxShadow: `0 0 0 8px var(--ios-glass)`,
              filter: "hue-rotate(85deg) saturate(180%)",
            }}
            animate={hasLiveMetrics ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 0.45 }}
            transition={{ duration: 1.2, repeat: hasLiveMetrics ? Infinity : 0 }}
          />
          <span className="text-sm font-medium" style={{ color: "var(--ios-text-primary)" }}>
            {signalLabel}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--ios-glass)" }}>
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--ios-text-primary)" }}>
            Height
          </p>
          <p className="mt-1 text-2xl font-bold" style={{ color: "var(--ios-text-primary)" }}>
            {userMetrics.height ?? "--"} {userMetrics.unit === "metric" ? "cm" : "in"}
          </p>
        </div>
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--ios-glass)" }}>
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--ios-text-primary)" }}>
            Weight
          </p>
          <p className="mt-1 text-2xl font-bold" style={{ color: "var(--ios-text-primary)" }}>
            {userMetrics.weight ?? "--"} {userMetrics.unit === "metric" ? "kg" : "lb"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-wider" style={{ color: "var(--ios-text-primary)" }}>
          Signal Strength
        </p>
        <div
          className="mt-2 h-3 w-full overflow-hidden rounded-full border"
          style={{ borderColor: "var(--ios-glass)" }}
          aria-label={`Signal strength ${signalStrength}%`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--ios-text-primary)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${signalStrength}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [userMetrics] = useState<UserMetrics>({
    height: 165,
    weight: 76,
    unit: "metric",
  });

  return (
    <main
      className="min-h-screen px-4 py-10 md:px-8"
      style={{ background: "var(--ios-background)", color: "var(--ios-text-primary)" }}
    >
      {/* DCO Sign-off: Signed-off-by: Cursor Agent <cursor-agent@local> */}
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm">Integrated health sync panel with live system signal.</p>
        </header>
        <DataVitalTracker userMetrics={userMetrics} />
      </div>
    </main>
  );
}
