import React from 'react';
import { useSignalCalculator } from '../../hooks/useSignalCalculator';

interface Props {
  signalId: string;
  label: string;
  weight: number;      // Added for the calculator
  signalType: string;  // Added for the calculator
}

export const SignalValueDisplay: React.FC<Props> = ({ signalId, label, weight, signalType }) => {
  // We provide all 3 arguments to ensure no 'NaN' errors
  const value = useSignalCalculator(signalId, weight, signalType);

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-1 text-2xl font-mono font-bold text-emerald-600">
        ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};