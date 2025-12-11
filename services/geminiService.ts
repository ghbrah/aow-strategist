// src/services/geminiService.ts
import { StrategyAdvice } from "../types";

/**
 * Fetches strategic advice from your Netlify function with password validation
 * and automatic retry on model overload (503) errors.
 * 
 * @param userQuery - The user's query describing a conflict or challenge.
 * @param password - The password typed by the user.
 * @param retries - Number of retry attempts on 503 errors (default: 2)
 * @param delayMs - Delay between retries in milliseconds (default: 1500)
 * @returns A StrategyAdvice object matching your interface.
 */
export const getStrategicAdvice = async (
  userQuery: string,
  password: string,
  retries = 2,
  delayMs = 1500
): Promise<StrategyAdvice> => {
  try {
    const response = await fetch('/.netlify/functions/get-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;

      // Retry automatically if the model is overloaded (503)
      if (status === 503 && retries > 0) {
        console.warn(`Model overloaded (503). Retrying in ${delayMs}ms...`);
        await new Promise(res => setTimeout(res, delayMs));
        return getStrategicAdvice(userQuery, password, retries - 1, delayMs);
      }

      throw new Error(errorData.error || `Server error: ${status}`);
    }

    const data: StrategyAdvice = await response.json();

    // Ensure optional fields exist
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

    // Handle API Key missing errors specifically
    if (error.message && (error.message.includes("API Key") || error.message.includes("API_KEY"))) {
      throw new Error("Configuration Error: Missing API Key. Please check your Netlify environment variables.");
    }

    throw error;
  }
};
