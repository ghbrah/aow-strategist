import { StrategyAdvice } from "../types";

export const getStrategicAdvice = async (userQuery: string): Promise<StrategyAdvice> => {
  try {
    const response = await fetch('/.netlify/functions/get-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data: StrategyAdvice = await response.json();
    return {
      title: data.title,
      originalQuote: data.originalQuote,
      interpretation: data.interpretation,
      actionableAdvice: data.actionableAdvice,
      chineseCharacter: data.chineseCharacter || undefined,
      characterExplanation: data.characterExplanation || undefined,
    };

  } catch (error: any) {
    console.error("Error fetching strategy:", error);
    if (error.message && (error.message.includes("API Key") || error.message.includes("API_KEY"))) {
      throw new Error("Configuration Error: Missing API Key. Check your Netlify environment variables.");
    }
    throw error;
  }
};
