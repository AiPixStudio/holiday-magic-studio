
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationOptions, ReferenceImage } from './types';

// Declare process to avoid TypeScript/Runtime reference errors
declare var process: any;

function fileToGenerativePart(base64: string, mimeType: string) {
  // Handle both data URI and raw base64
  const data = base64.includes(',') ? base64.split(',')[1] : base64;
  return {
    inlineData: {
      data,
      mimeType
    },
  };
}

const getStyleDescription = (style: string): string => {
  // Map User-Facing Style Names to Detailed Prompts
  // IDENTITY SAFETY NOTES ADDED: Explicitly telling the model NOT to beautify specific styles.
  switch (style) {
    // --- Naughty or Nice ---
    case 'Checking the List':
        return `Theme: Naughty or Nice - Checking the List. The subject is holding a long, vintage parchment scroll (Santa's List). They are pointing at a name with a shocked, laughing, or triumphant expression. Background: North Pole office. (CRITICAL: Apply expression WITHOUT changing the subject's facial identity or bone structure).`;
    case 'Caught Being Naughty':
        return `Theme: Naughty or Nice - Caught! The subject is humorously "caught" in the act (e.g. wrapped in lights). Fun, playful, slightly mischievous vibe. (CRITICAL: Maintain forensic likeness despite the playful expression).`;
    case 'Proudly Nice':
        return `Theme: Naughty or Nice - Angelic. The subject is wearing a subtle halo prop or holding a "Nice List" certificate. Soft, glowing, ethereal lighting.`;
    case 'The List Keeper':
        return `Theme: Naughty or Nice - The Judge. The subject is dressed as a modernized "List Keeper", holding a feather quill. Assessing the viewer with a knowing look. Cinematic, rich textures.`;

    // --- The Festive Gentleman (High Risk for Identity Drift) ---
    case 'Dapper Holiday Suit':
        return `Theme: Dapper Gentleman. High-end formal holiday party. ATTIRE: Tailored three-piece suit in velvet or wool. BACKGROUND: Upscale lounge, warm bokeh. VIBE: Sophisticated. (FORENSIC NOTE: Apply "GQ" lighting, but do NOT "beautify" or "yassify" the face. Keep rugged/real skin texture and original bone structure).`;
    case 'Rugged Winter Cabin':
        return `Theme: Rugged Winter Man. Outdoors or Rustic Cabin. ATTIRE: Heavy cable-knit sweater or flannel. BACKGROUND: Snowy forest. VIBE: Masculine, cozy.`;
    case 'Midnight Velvet':
        return `Theme: Midnight Velvet. Moody, dark aesthetic. ATTIRE: Black velvet blazer, dark tones. BACKGROUND: Shadowy, dramatic lighting. VIBE: Mysterious.`;
    case 'Modern Minimalist Man':
        return `Theme: Modern Minimalist Menswear. Clean, architectural. ATTIRE: High-quality cashmere, tailored coat. BACKGROUND: Modern winter city.`;
    case 'Classic Dad Christmas':
        return `Theme: Classic Wholesome Holiday. Family man aesthetic. ATTIRE: Premium quarter-zip sweater. BACKGROUND: Living room with tree. VIBE: Warm, happy.`;

    // --- Christmas Magic ---
    case 'Santa’s Workshop':
        return `Theme: Santa Storybook Workshop. Inside Santa’s Workshop. Warm, storybook-style scene. Santa sitting in a large wooden chair.`;
    case 'Ivory Elegance':
        return `Theme: Ivory Elegance. Soft, elegant, neutral-toned décor. Cream and gold tree. Dreamy, editorial. (FORENSIC NOTE: Maintain natural skin tones and HAIR colors. Do NOT darken blonde hair to match the cream palette. Keep individual features distinct).`;
    case 'Black Velvet Couture':
        return `Theme: Black Velvet Couture (Vogue Editorial). Family styled in coordinated BLACK VELVET couture. (FORENSIC NOTE: High-fashion styling, but keep the FACES 100% authentic to reference).`;
    case 'Lux Christmas Couture':
        return `Theme: Lux Christmas Couture. Avant-garde, expensive holiday fashion. Rich fabrics, jewelry, dramatic flair. (FORENSIC NOTE: Do not allow the high-fashion aesthetic to alter facial geometry. The subject must look exactly like the reference).`;
    case 'Holiday Gala':
        return `Theme: Holiday Gala. Formal Black Tie. Elegant, sophisticated, warm lighting.`;
    case 'Christmas & Cocoa':
        return `Theme: Cozy Christmas & Cocoa. Warm indoor scene, knitwear, sweaters. Intimate, joyful.`;
    case 'Indoor Traditional':
        return `Theme: Indoor Family Traditional. Rich textures (velvet, knit). Green, red, cream solid colors. Picture-perfect harmony.`;
    case 'Outdoor Traditional':
        return `Theme: Traditional Outdoor Christmas. Tartan flannel, brown leather, denim, snow jackets. Wholesome, snowy background.`;

    // --- Winter Magic (Non-Religious) ---
    case 'Ice Palace':
        return `Theme: Ice Palace. Grand, opulent hall enclosed by glass/mirrors. Blue sky visible. Shimmering crystal.`;
    case 'Winter Royalty':
        return `Theme: Winter Royalty. Ice Kings and Queens. Silver/blue ornate suits, faux fur cloaks. (FORENSIC NOTE: Costume is fantasy, FACE must remain realistic and true to reference).`;
    case 'Snowy Outdoor':
        return `Theme: Snowy Outdoor Landscape. Pristine nature, snow-covered pine trees. Subjects in warm, stylish winter gear.`;
    case 'Cozy Cabin':
        return `Theme: Cozy Winter Cabin. Rustic wooden interior, roaring fire. Hygge atmosphere.`;
    case 'Neutral Winter Studio':
        return `Theme: Neutral Winter Studio. Minimalist, high-key photography. White/Grey background. Focus on subjects.`;

    // --- Festival of Lights ---
    case 'Candlelit Portraits':
        return `Theme: Candlelit Portrait. Dark, moody background illuminated by dozens of warm candles. Soft, golden glow.`;
    case 'Gold + Blue Glow':
        return `Theme: Gold & Blue Celebration. Decor features rich royal blues and shimmering golds. Elegant, regal.`;
    case 'Warm Lantern Scene':
        return `Theme: Festival of Lanterns. Background of glowing paper lanterns. Warm orange/gold color palette.`;
    case 'Sparkling Lights Studio':
        return `Theme: Sparkling Lights. Bokeh-heavy background with thousands of tiny fairy lights. Joyful, bright.`;
    case 'Celebration Candle Wall':
        return `Theme: Wall of Candles. Background of structural niches holding flickering candles. Architectural.`;

    // --- Celebration Glow (Universal) ---
    case 'Elegant Gold Studio':
        return `Theme: Elegant Gold Studio. Background of textured gold leaf or golden drapes. High-fashion lighting.`;
    case 'Champagne Bokeh':
        return `Theme: Champagne Bokeh. Soft, out-of-focus champagne and silver lights. Abstract festive background.`;
    case 'Luxe Editorial Look':
        return `Theme: Luxe Editorial. Studio photography, stark or dramatic lighting.`;
    case 'Minimalist Festive Glow':
        return `Theme: Minimalist Glow. Clean background, single light source creating a halo effect.`;

    // --- Baby / Ornaments ---
    case 'Baby Snow Globe':
        return `Theme: Baby Snow Globe Ornament. SURREAL MINIATURE. Subject inside a glass snow globe.`;
    case 'Classic First Christmas Ornament':
        return `Theme: Classic Baby's First Christmas Ornament. CLOSE-UP ORNAMENT. Pastel/gold ornament.`;
    case 'Cozy Knit Pod Ornament':
        return `Theme: Cozy Knit Pod Ornament. Baby inside a hanging knit pod.`;
    case 'Keepsake Frame Ornament':
        return `Theme: Keepsake Frame Ornament. Square photo frame ornament labeled '2025'.`;
    case 'Moon & Stars Ornament':
        return `Theme: Moon & Stars Ornament. Baby on a crescent moon ornament.`;
    case 'Pastel Wreath Ornament':
        return `Theme: Pastel Wreath Ornament. Soft, fluffy wreath framing the face.`;
    case 'Vintage Swing Ornament':
        return `Theme: Vintage Swing Ornament. Baby on a tiny wooden swing ornament.`;
    
    // Legacy Ornaments
    case 'Baby\'s First Christmas': return `Theme: Baby's First Christmas Ornament. CLOSE-UP.`;
    case 'Glass Bauble (Full Body)': return `Theme: Glass Bauble (Full Body). SURREAL MINIATURE inside glass.`;
    case 'Snowflake (Face Only)': return `Theme: Snowflake Ornament. CLOSE-UP. Physical crystal snowflake framing face.`;
    case 'Ceramic Bulb (Face Only)': return `Theme: Flat Ceramic Ornament. CLOSE-UP. Flat white ceramic disc.`;
    case 'Vintage Glass Ornament': return `Theme: Vintage Glass Ornament. Reflection or Inside vintage mercury glass.`;
    case 'Snow Globe Scene': return `Theme: Snow Globe. SURREAL MINIATURE inside glass.`;

    default:
        return `Theme: Holiday Portrait. Festive, warm, and magical.`;
  }
}

// Helper to filter out "N/A" or "Let AI Decide" to keep prompt clean
const getCleanValue = (val: string | undefined): string | null => {
  if (!val || val === 'N/A' || val === 'Let AI Decide') return null;
  return val;
};

const buildGeneratorPrompt = (options: GenerationOptions, referenceImageCount: number): string => {
  const { theme, style, creativeNotes, peopleCount, petCount, artStyle, vibe, pose, backgroundIntensity, lightingTone, colorPalette, strictLikeness } = options;
  
  const styleDescription = getStyleDescription(style);
  
  // Clean values for use
  const cleanPose = getCleanValue(pose);
  const cleanBg = getCleanValue(backgroundIntensity);
  const cleanLighting = getCleanValue(lightingTone);
  const cleanPalette = getCleanValue(colorPalette);
  let cleanArt = getCleanValue(artStyle); 
  const cleanVibe = getCleanValue(vibe);
  
  // LOGIC: If we have reference images, we MUST trust the count of images over the dropdown
  // unless the dropdown is specific. But even then, if I upload 3 images, I expect 3 people.
  // We will force the count to match the reference count if references exist.
  let finalPeopleCount = getCleanValue(peopleCount);
  if (referenceImageCount > 0) {
      finalPeopleCount = String(referenceImageCount);
  }

  const cleanPet = getCleanValue(petCount);

  // --- START PROMPT CONSTRUCTION ---
  
  let prompt = `CRITICAL SYSTEM INSTRUCTION - CAST LIST & IDENTITY MAPPING:
You are generating a scene with a SPECIFIC CAST of characters based on the attached reference images.

**CAST LIST (MANDATORY):**
You have received ${referenceImageCount} distinct reference images.
You must generate a scene containing **EXACTLY ${referenceImageCount} HUMAN FIGURES**.

**ANTI-CLONING PROTOCOL:**
- Do **NOT** generate duplicates of the same person. 
- Do **NOT** generate "extras" or random background people. 
- The scene must contain ONLY the ${referenceImageCount} cast members (plus any pets if requested).
- If you generate 9 people, you have FAILED. If you generate 3 copies of Subject 1, you have FAILED.

**SPATIAL MAPPING (LEFT-TO-RIGHT):**
Assign the identities in this specific order:
`;

  // Explicitly list the mapping for the model
  if (referenceImageCount > 0) {
      for (let i = 1; i <= referenceImageCount; i++) {
        let position = "Center";
        if (referenceImageCount === 2) {
             position = i === 1 ? "Left" : "Right";
        } else if (referenceImageCount >= 3) {
             if (i === 1) position = "Far Left";
             else if (i === referenceImageCount) position = "Far Right";
             else position = "Center/Middle";
        }
        prompt += `- **Figure ${i} (${position})**: Must be a forensic match to **[Subject ${i}]**.\n`;
      }
  }

  prompt += `\n**IDENTITY & APPEARANCE LOCK:**
1. **Hair**: If Subject 1 is Blonde, Figure 1 is Blonde. If Subject 2 is Dark-haired, Figure 2 is Dark-haired.
2. **Face**: Perform a virtual "Face Swap" to graft the reference face onto the generated body.
3. **Age**: Maintain the age relative to the photo. Do not make adults into children or vice versa.
`;

  // --- STRICT LIKENESS INJECTION ---
  if (strictLikeness) {
      cleanArt = 'Photorealistic'; 
      prompt += `
      *** STRICT LIKENESS MODE ACTIVE ***
      - PRIORITY: FACE INTEGRITY > ARTISTIC STYLE.
      - ART STYLE OVERRIDE: Force PHOTOREALISTIC rendering (Canon EOS R5).
      - LIGHTING: Use standard neutral studio lighting on the faces.
      - DO NOT Apply heavy filters that obscure facial features.
      `;
  }

  // 2. THEME & SCENE
  prompt += `
  
  **SCENE SPECIFICATION:**
  - Concept: ${styleDescription}
  ${cleanVibe ? `- Mood/Vibe: ${cleanVibe}` : ''}
  ${cleanLighting ? `- Lighting: ${cleanLighting}` : ''}
  ${cleanBg ? `- Background: ${cleanBg}` : ''}
  ${cleanPalette ? `- Color Palette: ${cleanPalette}` : ''}
  ${cleanPose ? `- Pose: ${cleanPose}` : ''}
  ${cleanPet ? `- REQUIRED PETS: ${cleanPet}` : ''}
  
  **USER NOTES:**
  ${creativeNotes || 'None'}
  `;

  // 3. TECHNICAL STYLE
  if (cleanArt) {
      prompt += `\n**ART STYLE:** ${cleanArt}`;
      if (cleanArt === 'Photorealistic') {
          prompt += `- Output must be indistinguishable from a real photograph. Focus on realistic skin texture.`;
      }
  }

  // 4. FINAL VERIFICATION
  prompt += `
  
  **FINAL CHECKLIST:**
  1. Count the humans. Are there exactly ${referenceImageCount}? (If no, REJECT).
  2. Check Figure 1 (Left). Does it look like Subject 1?
  3. Check Figure ${referenceImageCount} (Right). Does it look like Subject ${referenceImageCount}?
  4. Are there any clones? (If yes, REJECT).
  `;

  return prompt;
};

export const generateImage = async (
  options: GenerationOptions,
  referenceImages: ReferenceImage[] = []
): Promise<string> => {
  // UPGRADE: Use 'gemini-3-pro-image-preview' for high-fidelity generation
  const model = 'gemini-3-pro-image-preview';
  const prompt = buildGeneratorPrompt(options, referenceImages.length);
  
  // Aspect Ratio Handling
  let ratio = options.aspectRatio;
  if (!ratio || ratio === 'Let AI Decide' || ratio === 'N/A') {
      ratio = '3:4';
  }

  try {
    // Re-initialize client to pick up latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [];
    
    // IMPORTANT: Clearer labeling for "Cast Members"
    if (referenceImages.length > 0) {
        parts.push({ text: "CAST LIST (REFERENCE IMAGES):" });
        referenceImages.forEach((img, index) => {
            // Explicitly label the image part
            parts.push({ text: `[IMAGE FOR SUBJECT ${index + 1}]:` });
            parts.push(fileToGenerativePart(img.base64, img.mimeType));
        });
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
           aspectRatio: ratio,
           imageSize: "1K" 
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error('No image data found in response.');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please check your prompt or reference images and try again.');
  }
};

export const analyzeImage = async (imageDataUrl: string, mimeType: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          fileToGenerativePart(imageDataUrl, mimeType),
          { text: "Analyze this image and provide a detailed visual description that can be used as a prompt to recreate it or edit it. Focus on style, lighting, setting, clothing, and subject pose." }
        ]
      }
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const editImage = async (imageDataUrl: string, mimeType: string, prompt: string, referenceImages: ReferenceImage[] = []): Promise<string> => {
    const model = 'gemini-3-pro-image-preview';
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const parts: any[] = [
            fileToGenerativePart(imageDataUrl, mimeType),
            { text: `Edit this image based on the following instructions: ${prompt}` }
        ];
        if (referenceImages && referenceImages.length > 0) {
            parts.push({ text: "Maintain the identity of the following reference subjects in the edited image:" });
            referenceImages.forEach(img => {
                 parts.push(fileToGenerativePart(img.base64, img.mimeType));
            });
        }
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE],
                imageConfig: {
                   imageSize: "1K" 
                }
            }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error('No edited image data returned.');
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image.");
    }
};
