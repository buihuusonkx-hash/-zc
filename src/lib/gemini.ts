import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateColoringPage(theme: string, index: number, size: "1K" | "2K" | "4K" = "1K") {
  const prompt = `A high-quality, simple black and white line art coloring page for children. 
  Theme: ${theme}. 
  Variation ${index + 1} of 5. 
  Style: Thick black outlines, no shading, no gradients, white background, suitable for crayons. 
  Subject: ${theme} in a fun, whimsical scene.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function startChat(systemInstruction: string) {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
    },
  });
}
