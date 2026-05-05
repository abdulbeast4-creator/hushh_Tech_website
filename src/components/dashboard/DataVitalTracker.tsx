import React from 'react';
import { motion } from 'framer-motion';

export interface VitalData {
  title: string;
  value: number;
  status: string;
}

const RING_SIZE = 140;
const STROKE_WIDTH = 12;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
};

export default function DataVitalTracker({ title, value, status }: VitalData) {
  const normalizedValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const strokeDashOffset = CIRCUMFERENCE * (1 - normalizedValue / 100);

  return (
    <motion.article
      className="group w-full min-w-0 rounded-[28px] border border-white/10 bg-[var(--ios-glass)] p-5 shadow-[0_24px_64px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:bg-[rgba(255,255,255,0.16)]"
      style={{ color: 'var(--ios-text-primary)' }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ios-text-secondary)]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-tight text-[var(--ios-text-primary)]">
            Data Transparency Score
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full bg-[var(--ios-card)]/10">
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="absolute"
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth={STROKE_WIDTH}
            />
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--ios-card)"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: strokeDashOffset }}
              transition={springTransition}
              style={{ rotate: -90, transformOrigin: '50% 50%' }}
            />
          </svg>

          <div className="relative flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold text-[var(--ios-text-primary)]">
              {Math.round(normalizedValue)}%
            </span>
            <span className="mt-1 text-sm font-medium text-[var(--ios-text-secondary)]">
              Trust meter
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-[var(--ios-card)]/12 px-4 py-3 text-[var(--ios-text-secondary)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--ios-text-secondary)]">
          Transparency Badge
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--ios-text-primary)]">
          {status}
        </p>
      </div>
    </motion.article>
  );
}
