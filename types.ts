export interface StrategyAdvice {
  title: string;
  originalQuote: string;
  interpretation: string;
  actionableAdvice: string[];
  chineseCharacter?: string; // Optional visual element
  characterExplanation?: string; // Explanation of the character's meaning
}

export interface HistoryItem {
  id: string;
  query: string;
  advice: StrategyAdvice;
  timestamp: number;
}