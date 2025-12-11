import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";

// We duplicate the interface here to ensure type safety within the backend function
// without needing complex shared file paths in the serverless build environment.
interface StrategyRequestBody {
  query: string;
}

const apiKey = process.env.API_KEY;

// Define the schema for the structured response
const strategySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The specific name of the strategy. CRITICAL: If it is one of the 36 Stratagems, you MUST include the number in the format 'Stratagem X: [Name]' (e.g., 'Stratagem 14: Borrow a Corpse to Resurrect the Soul').",
    },
    originalQuote: {
      type: Type.STRING,
      description: "A relevant quote from Sun Tzu's Art of War or the 36 Stratagems.",
    },
    interpretation: {
      type: Type.STRING,
      description: "A detailed, nuanced analysis of the conflict dynamics and why this specific strategy is the key to victory. Explain the underlying principle in depth and how it maps to the user's situation.",
    },
    actionableAdvice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3 concrete, tactical steps the user can take immediately.",
    },
    chineseCharacter: {
      type: Type.STRING,
      description: "A single relevant Chinese character (Kanji/Hanzi) representing the essence of the advice.",
    },
    characterExplanation: {
      type: Type.STRING,
      description: "A brief, insightful explanation of the selected Chinese character's literal meaning and its symbolic connection to the strategy.",
    }
  },
  required: ["title", "originalQuote", "interpretation", "actionableAdvice", "chineseCharacter", "characterExplanation"],
};

export default async (req: Request) => {
  // Handle CORS for preflight requests if testing locally
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!apiKey) {
    console.error("Server Error: API_KEY is missing in Netlify environment variables.");
    return new Response(JSON.stringify({ error: "Server configuration error. API Key missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json() as StrategyRequestBody;
    const userQuery = body.query;

    if (!userQuery) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelId = "gemini-2.5-flash";

    const systemInstruction = `
      You are a master strategist embodying the wisdom of Sun Tzu and the '36 Stratagems'.
      Users will present modern conflicts, difficulties, or challenges.
      
      Your Goal: Provide the single best strategic remedy.
      
      Process:
      1. Analyze the power dynamics and core conflict in the user's situation.
      2. Select the most applicable 'Stratagem' (from the 36 Stratagems) or Sun Tzu principle to resolve it.
      3. Provide a rich, detailed interpretation. Analyze the nuances of the user's situation and explain exactly *why* this strategy shifts the balance of power. Do not be superficial; draw deep parallels between the ancient principle and the modern problem.
      4. Convert the abstract strategy into concrete, actionable modern steps.
      5. Select a potent Chinese character (Hanzi) that embodies the strategy and explain its meaning.
      
      Constraints:
      - STRICT TITLE FORMATTING: If using one of the 36 Stratagems, the 'title' MUST be formatted as "Stratagem [Number]: [Name]" (e.g., "Stratagem 3: Kill with a Borrowed Knife"). Do not omit the number.
      - The 'interpretation' field should be insightful and comprehensive (2-3 paragraphs), not just a brief summary.
      - Focus on practical application and victory.
      - Use the JSON schema provided.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { role: "user", parts: [{ text: userQuery }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: strategySchema,
        temperature: 0.7,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from the strategist.");
    }

    return new Response(responseText, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Helpful if calling from different domains
      }
    });

  } catch (error: any) {
    console.error("Error in Netlify Function:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};