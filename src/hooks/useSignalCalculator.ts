import { useState, useEffect, useMemo } from 'react';
import { useVaultData } from './useVaultData'; 

export const useSignalCalculator = (signalId: string) => {
  const { signals, marketRates } = useVaultData();
  const calculatedValue = useMemo(() => {
    const signal = signals.find(s => s.id === signalId);
    if (!signal || !marketRates[signal.type]) return 0;

    // Core Logic: Weight * Market Multiplier
    return signal.weight * marketRates[signal.type].currentPrice;
  }, [signals, marketRates, signalId]);

  return calculatedValue;
};