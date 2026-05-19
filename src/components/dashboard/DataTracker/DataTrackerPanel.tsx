import { useEffect, useMemo, useState } from "react";
import { Activity, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

type TrackingSignal = {
  id: string;
  labelKey: string;
  sourceKey: string;
  valueKey: string;
  maskedValueKey: string;
  confidence: number;
  accentClassName: string;
};

type PrivacyEvent = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  timeKey: string;
};

const TRACKING_SIGNALS: TrackingSignal[] = [
  {
    id: "identity",
    labelKey: "dataTracker.signals.identity.label",
    sourceKey: "dataTracker.signals.identity.source",
    valueKey: "dataTracker.signals.identity.value",
    maskedValueKey: "dataTracker.signals.identity.maskedValue",
    confidence: 94,
    accentClassName: "bg-[#244d86]",
  },
  {
    id: "finance",
    labelKey: "dataTracker.signals.finance.label",
    sourceKey: "dataTracker.signals.finance.source",
    valueKey: "dataTracker.signals.finance.value",
    maskedValueKey: "dataTracker.signals.finance.maskedValue",
    confidence: 88,
    accentClassName: "bg-[#d1a15f]",
  },
  {
    id: "location",
    labelKey: "dataTracker.signals.location.label",
    sourceKey: "dataTracker.signals.location.source",
    valueKey: "dataTracker.signals.location.value",
    maskedValueKey: "dataTracker.signals.location.maskedValue",
    confidence: 81,
    accentClassName: "bg-[#0d8f6f]",
  },
  {
    id: "preferences",
    labelKey: "dataTracker.signals.preferences.label",
    sourceKey: "dataTracker.signals.preferences.source",
    valueKey: "dataTracker.signals.preferences.value",
    maskedValueKey: "dataTracker.signals.preferences.maskedValue",
    confidence: 76,
    accentClassName: "bg-black",
  },
];

const PRIVACY_EVENTS: PrivacyEvent[] = [
  {
    id: "sync",
    titleKey: "dataTracker.events.sync.title",
    descriptionKey: "dataTracker.events.sync.description",
    timeKey: "dataTracker.events.sync.time",
  },
  {
    id: "mask",
    titleKey: "dataTracker.events.mask.title",
    descriptionKey: "dataTracker.events.mask.description",
    timeKey: "dataTracker.events.mask.time",
  },
  {
    id: "consent",
    titleKey: "dataTracker.events.consent.title",
    descriptionKey: "dataTracker.events.consent.description",
    timeKey: "dataTracker.events.consent.time",
  },
];

function DataTrackerSkeleton() {
  const { t } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-[#e8dfcb] bg-[#fffaf0] p-6 shadow-sm md:p-8">
      <div className="h-4 w-32 animate-pulse rounded-full bg-[#e8dfcb]" />
      <div className="mt-5 h-10 w-2/3 animate-pulse rounded-xl bg-[#e8dfcb]" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-[#eee6d4]" />
      <p className="mt-5 text-sm font-medium text-[#5f5a4d]">
        {t("common.loading")}
      </p>
    </section>
  );
}

export default function DataTrackerPanel() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isMasked, setIsMasked] = useState(true);
  const [selectedSignalId, setSelectedSignalId] = useState(
    TRACKING_SIGNALS[0].id
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const selectedSignal = useMemo(
    () =>
      TRACKING_SIGNALS.find((signal) => signal.id === selectedSignalId) ||
      TRACKING_SIGNALS[0],
    [selectedSignalId]
  );

  if (!mounted) {
    return <DataTrackerSkeleton />;
  }

  return (
    <section className="rounded-[2rem] border border-[#e8dfcb] bg-[#fffaf0] p-6 text-gray-900 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#244d86]/15 bg-[#244d86]/5 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#244d86]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#244d86]">
              {t("dataTracker.eyebrow")}
            </span>
          </div>

          <h2
            className="mt-5 text-3xl font-normal leading-tight tracking-tight text-black md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("dataTracker.title")}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f5a4d] md:text-base">
            {t("dataTracker.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMasked((current) => !current)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black bg-black px-4 text-sm font-medium text-white transition hover:bg-transparent hover:text-black"
          aria-label={
            isMasked
              ? t("dataTracker.actions.revealAria")
              : t("dataTracker.actions.maskAria")
          }
        >
          {isMasked ? (
            <Eye className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          )}
          <span>
            {isMasked
              ? t("dataTracker.actions.reveal")
              : t("dataTracker.actions.mask")}
          </span>
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TRACKING_SIGNALS.map((signal) => {
          const isSelected = signal.id === selectedSignal.id;
          const displayValue = isMasked
            ? t(signal.maskedValueKey)
            : t(signal.valueKey);

          return (
            <button
              key={signal.id}
              type="button"
              onClick={() => setSelectedSignalId(signal.id)}
              className={`rounded-[1.4rem] border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                isSelected ? "border-black" : "border-[#e8dfcb]"
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b6252]">
                    {t(signal.sourceKey)}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-black">
                    {t(signal.labelKey)}
                  </h3>
                </div>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${signal.accentClassName}`}
                />
              </div>

              <p className="mt-4 truncate text-2xl font-semibold tracking-tight text-black">
                {displayValue}
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-medium text-[#5f5a4d]">
                  <span>{t("dataTracker.confidence")}</span>
                  <span>
                    {t("dataTracker.confidenceValue", {
                      value: signal.confidence,
                    })}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eee6d4]">
                  <div
                    className={`h-full rounded-full ${signal.accentClassName}`}
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.6rem] border border-black bg-[#050505] p-6 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {t("dataTracker.zeroKnowledge.eyebrow")}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {t(selectedSignal.labelKey)}
              </h3>
            </div>
            <LockKeyhole className="h-5 w-5 text-white/60" />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              {t("dataTracker.zeroKnowledge.preview")}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">
              {isMasked
                ? t(selectedSignal.maskedValueKey)
                : t(selectedSignal.valueKey)}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {isMasked
                ? t("dataTracker.zeroKnowledge.maskedNote")
                : t("dataTracker.zeroKnowledge.revealedNote")}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {t("dataTracker.summary.encrypted")}
              </p>
              <p className="mt-2 text-sm font-medium">
                {t("dataTracker.summary.encryptedValue")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {t("dataTracker.summary.consent")}
              </p>
              <p className="mt-2 text-sm font-medium">
                {t("dataTracker.summary.consentValue")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {t("dataTracker.summary.mode")}
              </p>
              <p className="mt-2 text-sm font-medium">
                {isMasked
                  ? t("dataTracker.summary.modeMasked")
                  : t("dataTracker.summary.modeVisible")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-[#e8dfcb] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#244d86]">
                {t("dataTracker.timeline.eyebrow")}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-black">
                {t("dataTracker.timeline.title")}
              </h3>
            </div>
            <Activity className="h-5 w-5 text-[#244d86]" />
          </div>

          <div className="mt-6 space-y-4">
            {PRIVACY_EVENTS.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-[#ece4d2] bg-[#faf5ea] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-black">
                      {t(event.titleKey)}
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-[#5f5a4d]">
                      {t(event.descriptionKey)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#e8dfcb] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b6252]">
                    {t(event.timeKey)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
