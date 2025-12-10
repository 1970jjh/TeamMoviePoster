import { GoogleGenAI, Modality } from '@google/genai';
import { MovieStyle } from '../types';

interface TeamInfo {
  teamName: string;
  members: string;
  slogan: string;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function generatePoster(
  images: File[],
  teamInfo: TeamInfo,
  style: MovieStyle,
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!key || key === 'PLACEHOLDER_API_KEY') {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const imageContents = await Promise.all(
    images.map(async (file) => ({
      inlineData: {
        mimeType: file.type,
        data: await fileToBase64(file),
      },
    }))
  );

  const prompt = `Create a professional movie poster with the following specifications:
- Team Name: "${teamInfo.teamName}"
- Team Members: ${teamInfo.members}
- Slogan/Tagline: "${teamInfo.slogan}"
- Movie Style: ${style.name}
- Style Description: ${style.promptAddon}

The poster should:
1. Feature the people from the uploaded photos as the main characters
2. Apply the ${style.name} movie style aesthetically
3. Include the team name as the movie title prominently
4. Display the slogan as a tagline
5. List the team members like movie cast credits
6. Look like an authentic professional movie poster

Generate a high-quality, cinematic movie poster image.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp-image-generation',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          ...imageContents.map((img) => img),
        ],
      },
    ],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error('포스터 생성에 실패했습니다. 응답이 없습니다.');
  }

  for (const part of parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${imageData}`;
    }
  }

  throw new Error('포스터 이미지가 생성되지 않았습니다.');
}
