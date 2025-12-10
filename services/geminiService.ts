import { GoogleGenAI } from "@google/genai";
import { MovieStyle } from "../types";

const fileToGenericBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
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
  // Use manual key if provided, otherwise fallback to env
  const apiKey = manualApiKey || process.env.API_KEY;
  
  if (!apiKey) throw new Error("API Key is missing. Please enter a valid key in the Admin settings.");
  if (!imageFiles || imageFiles.length === 0) throw new Error("No images provided");

  const ai = new GoogleGenAI({ apiKey });
  
  // Convert all images to base64 parts
  const imageParts = await Promise.all(
    imageFiles.map(async (file) => {
      const base64Data = await fileToGenericBase64(file);
      return {
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      };
    })
  );

  const prompt = `
    Create a high-quality, cinematic movie poster based on the attached reference images.
    There are ${imageFiles.length} reference image(s) provided.
    
    Target Style: ${style.name} (${style.promptAddon}).
    
    Instructions:
    1. **CHARACTER INTEGRATION**: Identify the faces in the uploaded images. Transform them into the MAIN CHARACTERS of this poster. 
       - If multiple people are in the photos, group them together epicly.
       - Style their costumes, hair, and lighting to perfectly match the '${style.name}' movie universe.
       - Make them look heroic, dramatic, or hilarious depending on the genre.

    2. **TEXT & CREDITS (CRITICAL - MAKE IT FUNNY)**: 
       - **Main Title**: "${details.teamName}" (Render this HUGE in the movie's signature font style).
       - **Tagline**: "${details.slogan}" (Place this visibly).
       - **The Billing Block (Bottom Credits)**: take the provided member names: "${details.members}" and assign them FAKE MOVIE ROLES at the bottom of the poster.
         - *Examples of formatting to use*: "DIRECTED BY [Name 1]", "STARRING [Name 2]", "STUNT COORDINATOR [Name 3]", "CATERING BY [Name 4]", "VISUAL EFFECTS [Name 5]". 
         - Mix real roles (Director, Producer) with funny ones if appropriate.
         - Use the classic "tall, condensed" movie credit font.
       - **Extra Details**: Add cinematic fluff text like "COMING SOON", "IN THEATERS NOW", "A [Team Name] PRODUCTION", or award laurels/wreaths to make it look authentic.

    3. **COMPOSITION**:
       - Standard Portrait Movie Poster ratio (3:4 or 4:6).
       - High contrast, professional color grading.
       - Ensure the text doesn't cover the faces of the characters.

    4. **VIBE**: 
       - Make it look like a REAL blockbuster poster that costs millions of dollars.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Nano Banana Pro for high quality text + image
      contents: {
        parts: [
          {
            text: prompt,
          },
          ...imageParts, // Spread all image parts here
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Closest to 4:6 standard poster ratio available in API
            imageSize: "1K"
        },
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};