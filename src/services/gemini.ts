import { GoogleGenAI, Type } from "@google/genai";
import { ColorID } from "../types";

export async function analyzeImage(base64Image: string): Promise<ColorID[][] | null> {
  // Use VITE_ prefix for Vercel compatibility, fallback to process.env for AI Studio
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
  
  if (!apiKey) {
    console.error("CRITICAL: Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in Vercel Environment Variables.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Detect environment to choose correct model
  // AI Studio usually has GEMINI_API_KEY in process.env and runs on *.run.app
  const isAiStudio = typeof process !== 'undefined' && process.env.GEMINI_API_KEY;
  const defaultModel = isAiStudio ? "gemini-3-flash-preview" : "gemini-1.5-flash";
  const modelName = import.meta.env.VITE_GEMINI_MODEL || defaultModel;

  console.log(`Using model: ${modelName} for analysis`);

  const prompt = `
    Analyze this Water Sort Puzzle image. 
    There are 12 tubes. 10 are partially filled, 2 are empty.
    Each tube can have up to 4 layers.
    Identify the icons in each layer from BOTTOM to TOP.
    Icons mapping:
    - Heart shape -> HEART
    - Lightning/Zap -> ZAP
    - Circle -> CIRCLE
    - Plus sign -> PLUS
    - Triangle -> TRIANGLE
    - Square -> SQUARE
    - Minus sign -> MINUS
    - Water droplet -> DROPLET
    - Diamond -> DIAMOND
    - Star -> STAR
    - Question mark '?' or hidden/grayed out -> UNKNOWN

    Return ONLY a JSON array of 12 arrays. Each sub-array contains the ColorIDs from BOTTOM to TOP.
    Example: [["HEART", "ZAP"], [], ["STAR", "STAR", "STAR", "STAR"], ...]
    Ensure exactly 12 tubes are returned.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1] || base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    let text = response.text;
    if (!text) {
      console.error("Gemini returned empty text response");
      return null;
    }
    
    // Clean up potential markdown blocks if the model ignores responseMimeType
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.length === 12) {
      return data as ColorID[][];
    }
    
    console.error("Invalid data structure received from Gemini:", data);
    return null;
  } catch (error) {
    console.error("Gemini Vision Error Details:", error);
    return null;
  }
}
