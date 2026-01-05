
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeImage = async (
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getAI();
  const imagePart = {
    inlineData: {
      data: base64Data.split(',')[1] || base64Data,
      mimeType,
    },
  };
  const textPart = { text: prompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text || "分析失败，请稍后重试。";
};

export const translateText = async (text: string, targetLang: 'Chinese' | 'English'): Promise<string> => {
  const ai = getAI();
  const prompt = `Please translate the following content into ${targetLang}. Keep the structure and technical terms accurate: \n\n${text}`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || "翻译失败";
};
