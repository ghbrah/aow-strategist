// netlify/functions/get-strategy.ts
import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";

interface StrategyRequestBody {
  query: string;
  password?: string; // Add password field
}

const apiKey = process.env.GEMINI_API_KEY;

// Password you set
const PASSWORD = "$untzu";

// Define the schema
const strategySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    originalQuote: { type: Type.STRING },
    interpretation: { type: Type.STRING },
    actionableAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
    chineseCharacter: { type: Type.STRING },
    characterExplanation: { type: Type.STRING },
  },
  required: ["title", "originalQuote", "interpretation", "actionableAdvice", "chineseCharacter", "characterExplanation"],
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY missing in Netlify environment variables." }), { status: 500 });
  }

  try {
    const body = await req.json() as StrategyRequestBody;

    if (!body.password || body.password !== PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid password." }), { status: 401 });
    }

    const userQuery = body.query;
    if (!userQuery) {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

    const systemInstruction = `
      You are a master strategist. Analyze the user's situation and provide detailed strategic advice.
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

    if (!response.text) throw new Error("No response from strategist");

    return new Response(response.text, {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
};
