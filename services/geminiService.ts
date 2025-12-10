import { GoogleGenAI } from "@google/genai";
import { MovieStyle } from "../types";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generatePoster = async (
  imageFiles: File[],
  details: { teamName: string; members: string; slogan: string },
  style: MovieStyle,
  manualApiKey?: string
): Promise<string> => {
  const apiKey = manualApiKey || process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new Error("API Key가 설정되지 않았습니다. Vercel 환경변수에 GEMINI_API_KEY를 설정해주세요.");
  }

  if (!imageFiles || imageFiles.length === 0) {
    throw new Error("이미지가 제공되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert images to base64 parts for Gemini multimodal input
  const imageParts = await Promise.all(
    imageFiles.map(async (file) => {
      const base64Data = await fileToBase64(file);
      return {
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      };
    })
  );

  const prompt = `You are a professional movie poster designer. Create a stunning, high-quality movie poster.

REFERENCE IMAGES: I'm providing ${imageFiles.length} photo(s) of real people. These are the team members who should appear as the MAIN CHARACTERS in the poster.

MOVIE STYLE: ${style.name}
STYLE DETAILS: ${style.promptAddon}

POSTER REQUIREMENTS:
1. CHARACTERS: The people from the reference photos must be the main characters
   - Transform them to match the "${style.name}" movie aesthetic
   - Appropriate costumes, lighting, and poses for the genre
   - Keep their faces recognizable but stylized

2. TEXT ELEMENTS (in Korean/English mix):
   - TITLE: "${details.teamName}" - Large, prominent, in the movie's signature font style
   - TAGLINE: "${details.slogan}" - Visible subtitle/catchphrase
   - CREDITS at bottom: "${details.members}" - Format as movie credits (DIRECTED BY, STARRING, etc.)
   - Add "COMING SOON" or similar cinematic text

3. COMPOSITION:
   - Professional movie poster layout (portrait 2:3 ratio)
   - Dramatic lighting and color grading matching "${style.name}"
   - High production value, cinematic quality

4. OUTPUT: Generate a complete, polished movie poster image.`;

  try {
    // Gemini 3.0 Pro Image Preview (나노바나나 프로)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            ...imageParts,
          ],
        },
      ],
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Extract generated image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    // If no image in response, throw error with details
    const textResponse = parts?.find(p => p.text)?.text || '';
    throw new Error(`이미지 생성 실패. 모델 응답: ${textResponse.substring(0, 200)}`);

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);

    // Provide more helpful error messages
    if (error.message?.includes('API key')) {
      throw new Error("API Key가 유효하지 않습니다. Vercel 환경변수를 확인해주세요.");
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error("API 사용량 한도 초과. 잠시 후 다시 시도해주세요.");
    }
    if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      throw new Error("안전 필터에 의해 차단되었습니다. 다른 이미지나 스타일을 시도해주세요.");
    }

    throw error;
  }
};
