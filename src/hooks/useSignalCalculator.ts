import { useMemo } from 'react';
// We use useStockQuotes since it's actually in your directory
import { useStockQuotes } from './useStockQuotes';

export const useVaultSignalCalculator = (signalId: string) => {
  const { signals, marketRates } = useVaultData();
  const calculatedValue = useMemo(() => {
    const signal = signals.find(s => s.id === signalId);
    if (!signal || !marketRates[signal.type]) return 0;

    // Core Logic: Weight * Market Multiplier
    return signal.weight * marketRates[signal.type].currentPrice;
  }, [signals, marketRates, signalId]);

  return calculatedValue;
};

export const useStockSignalCalculator = (signalId: string, weight: number, signalType: string) => {
  const { quotes } = useStockQuotes();

  // Return the computed value DIRECTLY (no useState/useEffect)
  return useMemo(() => {
    // Find the market price from the real stock quotes hook
    const quote = quotes.find(q => q.symbol === signalType || q.id === signalId);
    const price = quote?.price || 0;

    // Core Logic: Weight * Market Price
    return weight * price;
  }, [quotes, weight, signalType, signalId]);
};

