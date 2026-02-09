import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHaiku = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a poetic haiku about: ${topic}. 
      
      Rules:
      1. Strictly 3 lines.
      2. Syllable structure 5-7-5.
      3. Return ONLY the poem text, no title or explanation.`,
      config: {
        temperature: 0.8,
      }
    });

    return response.text?.trim() || "Silence fills the void,\nAPI returns no words now,\nPeace is found within.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};