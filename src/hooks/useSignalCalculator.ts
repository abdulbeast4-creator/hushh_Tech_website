import { useMemo } from 'react';
import { useStockQuotes } from './useStockQuotes';

export const useSignalCalculator = (signalId: string, weight: number, signalType: string) => {
  const { quotes } = useStockQuotes();

  return useMemo(() => {
    // 1. Safety Check: Ensure quotes exists before searching
    if (!quotes) return 0;

    const quote = quotes.find(q => q.id === signalId) || quotes.find(q => q.symbol === signalType);
    
    // 2. The Bot's Suggestion: Guard against missing data
    if (!quote || quote.price === undefined) return 0;

    // Core Logic: Weight * Market Price
    return weight * quote.price;
  }, [quotes, weight, signalType, signalId]);
};
