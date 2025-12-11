import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";

interface StrategyRequestBody {
  query: string;
  password?: string; // Expect password from frontend
}

const apiKey = process.env.GEMINI_API_KEY;
const PASSWORD = '$untzu'; // Must match App.tsx

const strategySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Strategy title (36 Stratagems format required)." },
    originalQuote: { type: Type.STRING, description: "Relevant quote from Sun Tzu or 36 Stratagems." },
    interpretation: { type: Type.STRING, description: "Detailed analysis of conflict dynamics." },
    actionableAdvice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 tactical steps." },
    chineseCharacter: { type: Type.STRING, description: "Relevant Chinese character." },
    characterExplanation: { type: Type.STRING, description: "Explanation of character meaning." }
  },
  required: ["title", "originalQuote", "interpretation", "actionableAdvice", "chineseCharacter", "characterExplanation"],
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server configuration error. GEMINI_API_KEY missing." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json() as StrategyRequestBody;
    const userQuery = body.query;
    const password = body.password;

    // Check password
    if (password !== PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized. Invalid password." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!userQuery) {
      return new Response(JSON.stringify({ error: "Query is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

    const systemInstruction = `
      You are a master strategist following Sun Tzu and the 36 Stratagems...
      (rest of instructions remain the same)
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

    if (!response.text) throw new Error("No response received from the strategist.");

    return new Response(response.text, {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
