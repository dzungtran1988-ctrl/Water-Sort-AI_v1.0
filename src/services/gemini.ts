import { GoogleGenAI, Type } from "@google/genai";
import { ColorID } from "../types";

export async function analyzeImage(base64Image: string): Promise<ColorID[][] | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
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
      model: "gemini-3-flash-preview",
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

    const text = response.text;
    if (!text) return null;
    
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.length === 12) {
      return data as ColorID[][];
    }
    return null;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
}
