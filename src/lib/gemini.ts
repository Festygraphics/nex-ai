import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export async function getAstraResponse(prompt: string, context?: string) {
  if (!apiKey) {
    return "AI Brain not configured. Please add GEMINI_API_KEY to environment variables.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are AstraAI, a futuristic, highly intelligent crypto agent. 
          Your tone is professional, slightly cyberpunk, and very data-driven.
          Current context: ${context || 'General crypto market analysis'}.
          
          User Question: ${prompt}
          
          Provide a detailed analysis, risk score (0-100), and specific recommendations. 
          Use markdown for formatting. If the user asks for a portfolio, suggest a balanced one.` }]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to Astra's neural network. Please try again later.";
  }
}
