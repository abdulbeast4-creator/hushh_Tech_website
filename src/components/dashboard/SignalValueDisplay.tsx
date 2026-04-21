import React from 'react';
import { useSignalCalculator } from '../../hooks/useSignalCalculator';

interface Props {
  signalId: string;
  label: string;
}

export const SignalValueDisplay: React.FC<Props> = ({ signalId, label }) => {
  const value = useSignalCalculator(signalId);

  return (
    <div className="p-4 rounded-lg bg-ghost-subtle border border-ghost-accent">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="text-2xl font-mono font-bold text-green-400">
        ${value.toFixed(2)}
      </div>
    </div>
  );
};