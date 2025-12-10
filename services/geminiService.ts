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

  // 팀원 이름을 배열로 파싱
  const memberNames = details.members.split(',').map(name => name.trim()).filter(name => name);

  // 팀원들에게 영화 역할 배정
  const roles = ['감독 DIRECTED BY', '주연 STARRING', '조연 CO-STARRING', '특별출연 SPECIAL APPEARANCE', '우정출연 FRIENDSHIP APPEARANCE', '제작 PRODUCED BY', '각본 WRITTEN BY', '촬영 CINEMATOGRAPHY'];
  const memberCredits = memberNames.map((name, idx) => {
    const role = roles[idx % roles.length];
    return `${role} ${name}`;
  }).join(' · ');

  const prompt = `You are a legendary Hollywood movie poster designer. Create an AUTHENTIC, CINEMATIC movie poster that looks like it cost $10 million to produce.

═══════════════════════════════════════
📸 REFERENCE PHOTOS
═══════════════════════════════════════
I'm providing ${imageFiles.length} photo(s) of real people. These are the team members who MUST appear as the MAIN CHARACTERS in the poster. Transform them into movie stars!

═══════════════════════════════════════
🎬 MOVIE INFORMATION
═══════════════════════════════════════
• MOVIE TITLE: "${details.teamName}"
• MOVIE STYLE: ${style.name}
• VISUAL STYLE: ${style.promptAddon}
• TEAM SLOGAN: "${details.slogan}"
• CAST & CREW: ${memberCredits}

═══════════════════════════════════════
🎨 POSTER DESIGN REQUIREMENTS
═══════════════════════════════════════

1. **MAIN VISUAL (Most Important!)**
   - The people from reference photos are the HEROES of this poster
   - Transform them into "${style.name}" movie characters
   - Epic poses, dramatic expressions, movie-star styling
   - Professional costume design matching the genre
   - Cinematic lighting and atmosphere

2. **TITLE TREATMENT**
   - "${details.teamName}" as the MAIN TITLE
   - Huge, bold, iconic font matching "${style.name}" style
   - Add visual effects (glow, metallic, 3D, etc.) appropriate to genre

3. **ICONIC MOVIE QUOTE (IMPORTANT!)**
   - Create a memorable, powerful quote that fits "${style.name}" movie
   - Examples: "With great power comes great responsibility" / "I'll be back" / "May the Force be with you"
   - Place it prominently on the poster
   - The quote should relate to team spirit, unity, or the movie's theme

4. **TAGLINE**
   - "${details.slogan}" as the tagline/catchphrase
   - Stylish placement, readable but not overpowering

5. **MOVIE CREDITS (Bottom Section)**
   - Classic movie poster billing block style
   - ${memberCredits}
   - Use the tall, condensed "Steel Tongs" style credit font
   - Add studio logos, rating badges, release date "COMING SOON"

6. **COMPOSITION & QUALITY**
   - Portrait orientation (2:3 movie poster ratio)
   - Hollywood blockbuster production quality
   - Professional color grading matching "${style.name}"
   - Dramatic lighting, depth, and atmosphere
   - Make it look like a REAL theatrical release poster

═══════════════════════════════════════
🎯 OUTPUT
═══════════════════════════════════════
Generate ONE stunning, complete movie poster image that would make audiences want to buy tickets immediately!`;

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
