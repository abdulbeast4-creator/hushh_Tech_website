import { CheckCircle, XCircle, Clock, Tag } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConsentLog {
  id: string;
  /** ISO 8601 date string */
  timestamp: string;
  /** e.g. "Read Access", "Write Access", "Delete Request" */
  action: string;
  /** e.g. "Analytics", "Personalisation", "Third-party Sharing" */
  purpose: string;
  status: 'granted' | 'revoked';
}

export interface ConsentCardProps {
  log: ConsentLog;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// ─── ConsentCard ──────────────────────────────────────────────────────────────

export function ConsentCard({ log }: ConsentCardProps): JSX.Element {
  const isGranted = log.status === 'granted';

  return (
    <article
      aria-label={`${log.action} — ${isGranted ? 'Granted' : 'Revoked'}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <span
          className={isGranted ? 'text-green-500 flex-shrink-0 mt-0.5' : 'text-red-500 flex-shrink-0 mt-0.5'}
          aria-hidden="true"
        >
          {isGranted ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
        </span>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Action + badge row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {log.action}
            </p>
            <span
              className={
                isGranted
                  ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 self-start sm:self-auto'
                  : 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 self-start sm:self-auto'
              }
            >
              {isGranted ? 'Granted' : 'Revoked'}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Tag className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              {log.purpose}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <time dateTime={log.timestamp}>{formatTimestamp(log.timestamp)}</time>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
