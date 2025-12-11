import { StrategyAdvice } from "../types";

export const getStrategicAdvice = async (userQuery: string): Promise<StrategyAdvice> => {
  try {
    // We now call our own backend API (Netlify Function)
    // The netlify.toml redirects /api/* to the function
    const response = await fetch('/api/get-strategy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as StrategyAdvice;

  } catch (error) {
    console.error("Error fetching strategy:", error);
    throw error;
  }
};