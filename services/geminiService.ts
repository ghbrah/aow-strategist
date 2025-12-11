// src/services/geminiService.ts
import { StrategyAdvice } from "../types";

/**
 * Fetches strategic advice from your Netlify function.
 * @param userQuery - The user's query describing a conflict or challenge.
 * @returns A StrategyAdvice object matching your interface.
 */
export const getStrategicAdvice = async (userQuery: string): Promise<StrategyAdvice> => {
  try {
    const response = await fetch('/.netlify/functions/get-strategy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: userQuery,
        password: "$untzu"  // Simple password for access control
      }),
    });

    if (!response.ok) {
      // Attempt to extract error message from server
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data: StrategyAdvice = await response.json();

    // Optional: ensure optional fields exist
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
