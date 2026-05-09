import { FileText } from 'lucide-react';
import { ConsentCard, ConsentLog } from './ConsentCard';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConsentTimelineProps {
  logs: ConsentLog[];
  loading?: boolean;
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
// Mirrors ConsentCard layout exactly so there is zero layout shift on load.

const SkeletonCard = (): JSX.Element => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 animate-pulse">
    <div className="flex items-start gap-3">
      {/* Icon placeholder */}
      <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5" />

      <div className="flex-1 space-y-2">
        {/* Action + badge row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded-full" />
        </div>
        {/* Meta row */}
        <div className="flex gap-4">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Timeline Item ────────────────────────────────────────────────────────────
// Wraps each card in a flex row that draws the vertical connector line.

interface TimelineItemProps {
  log: ConsentLog;
  isLast: boolean;
}

const TimelineItem = ({ log, isLast }: TimelineItemProps): JSX.Element => (
  <li className="flex gap-3 sm:gap-4">
    {/* Connector column — dot + vertical line */}
    <div className="flex flex-col items-center flex-shrink-0 pt-5" aria-hidden="true">
      <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
      {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-3" />}
    </div>

    {/* Card */}
    <div className={`flex-1 ${isLast ? '' : 'pb-3'}`}>
      <ConsentCard log={log} />
    </div>
  </li>
);

// ─── ConsentTimeline ──────────────────────────────────────────────────────────

export function ConsentTimeline({
  logs,
  loading = false,
}: ConsentTimelineProps): JSX.Element {
  return (
    <section aria-label="Data Access Event Log" className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-900">
          Data Access Event Log
        </h2>
      </div>

      {/* aria-live region — screen readers announce load completion */}
      <span role="status" aria-live="polite" className="sr-only">
        {loading
          ? 'Loading secure log entries…'
          : `${logs.length} event${logs.length !== 1 ? 's' : ''} in the secure log`}
      </span>

      {loading ? (
        /* ── Skeleton loading state ── */
        <div aria-hidden="true" className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : logs.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <FileText className="w-8 h-8 text-gray-300 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-500">No events recorded</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Data access events will appear here when logged.
          </p>
        </div>
      ) : (
        /* ── Timeline list ── */
        <ul role="list" className="space-y-0">
          {logs.map((log, index) => (
            <TimelineItem
              key={log.id}
              log={log}
              isLast={index === logs.length - 1}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
