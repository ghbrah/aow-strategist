import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Interface for request body
interface StrategyRequestBody {
  query: string;
  password?: string; // Added password field
}

// Fetch API key from Netlify environment
const apiKey = process.env.GEMINI_API_KEY;

// Define the schema for the structured response
const strategySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The specific name of the strategy. CRITICAL: If it is one of the 36 Stratagems, you MUST include the number in the format 'Stratagem X: [Name]'",
    },
    originalQuote: { type: Type.STRING },
    interpretation: { type: Type.STRING },
    actionableAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
    chineseCharacter: { type: Type.STRING },
    characterExplanation: { type: Type.STRING },
  },
  required: ["title", "originalQuote", "interpretation", "actionableAdvice", "chineseCharacter", "characterExplanation"],
};

export default async (req: Request) => {
  // Handle CORS for preflight requests
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
    console.error("Server Error: GEMINI_API_KEY is missing in Netlify environment variables.");
    return new Response(JSON.stringify({ error: "Server configuration error. GEMINI_API_KEY missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json() as StrategyRequestBody;

    // ---------- Simple password lock ----------
    if (body.password !== "$untzu") {
      return new Response(JSON.stringify({ error: "Unauthorized: wrong password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userQuery = body.query;
    if (!userQuery) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

    const systemInstruction = `
      You are a master strategist embodying the wisdom of Sun Tzu and the '36 Stratagems'.
      Users will present modern conflicts, difficulties, or challenges.
      
      Your Goal: Provide the single best strategic remedy.
      
      Constraints:
      - STRICT TITLE FORMATTING: If using one of the 36 Stratagems, the 'title' MUST include number.
      - Interpretations must be 2-3 paragraphs and practical.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: userQuery }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: strategySchema,
        temperature: 0.7,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response received from the strategist.");

    return new Response(responseText, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    console.error("Error in Netlify Function:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
