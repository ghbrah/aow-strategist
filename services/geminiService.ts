// src/services/geminiService.ts
import { StrategyAdvice } from "../types";

/**
 * Fetches strategic advice from your Netlify function with password and timeout handling.
 * @param userQuery - The user's query describing a conflict or challenge.
 * @param timeoutMs - Maximum time to wait for a response (default: 15s)
 * @returns StrategyAdvice object
 */
export const getStrategicAdvice = async (
  userQuery: string,
  timeoutMs = 15000
): Promise<StrategyAdvice> => {
  try {
    // AbortController allows timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    const response = await fetch('/.netlify/functions/get-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ query: userQuery, password: '$untzu' }) // send password
    });

    clearTimeout(timeout);

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

    if (error.name === 'AbortError') {
      throw new Error(
        "The strategist is taking too long to respond. Please try again or check your connection."
      );
    }

    if (error.message && (error.message.includes("API Key") || error.message.includes("API_KEY"))) {
      throw new Error("Configuration Error: Missing API Key. Please check your Netlify environment variables.");
    }

    throw error;
  }
};
