import { GoogleGenAI } from "@google/genai";

const MODELS = ['gemini-3-flash-preview', 'gemini-3.1-pro-preview', 'gemini-2.5-flash-preview'];

export async function callGeminiAI(prompt: string, modelIndex = 0): Promise<string | null> {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('Vui lòng nhập API Key trong phần Cài đặt!');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODELS[modelIndex],
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    return response.text || '';
  } catch (error: any) {
    console.error(`Error with model ${MODELS[modelIndex]}:`, error);
    
    // Fallback logic
    if (modelIndex < MODELS.length - 1) {
      return callGeminiAI(prompt, modelIndex + 1);
    }
    
    throw error;
  }
}

export const PROMPTS = {
  SUGGEST_OUTCOMES: (topic: string) => `Hãy đề xuất 5 yêu cầu cần đạt (YCCĐ) cho chủ đề Toán học: "${topic}" theo chương trình GDPT 2018. Trả về dưới dạng JSON array: [{"code": "Mã", "content": "Nội dung"}].`,
  GENERATE_QUESTION: (topic: string, outcome: string, level: string, type: string) => `Hãy soạn 1 câu hỏi Toán học cho chủ đề "${topic}", yêu cầu cần đạt "${outcome}", mức độ "${level}", dạng "${type}". Trả về JSON: {"content": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..."}.`
};
