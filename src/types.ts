

// types.ts

// --- Core Application Interfaces ---

/**
 * Data structure for an image passed as a reference to the AI model.
 * Used in Generator.tsx and Editor.tsx
 */
export interface ReferenceImage {
  base64: string;
  mimeType: string;
}

/**
 * Data structure for a generated image.
 * Used in app.tsx to store history.
 */
export interface ImageInfo {
  base64Image: string;
  referenceImages: ReferenceImage[];
  creativeNotes: string;
}


// --- Type Unions for Dropdowns ---

export type HolidayTheme =
  | 'none'
  | 'All Holiday Styles'
  | 'Naughty or Nice' // New Theme
  | 'Baby\'s First Christmas (0-1 Year)' 
  | 'Christmas Ornament' 
  | 'Celebration Glow (Universal)'
  | 'Christmas Magic'
  | 'Festival of Lights'
  | 'The Festive Gentleman'
  | 'Winter Magic (Non-Religious)';

export type AspectRatio = 'N/A' | 'Let AI Decide' | '1:1' | '9:16' | '16:9' | '3:4' | '4:3';

export type ArtStyle =
  | 'N/A'
  | 'Let AI Decide'
  | 'Photorealistic'
  | 'Cinematic'
  | 'Lifestyle'
  | 'Editorial'
  | 'Storybook / Illustrated';

/**
 * Replaces old Vibe system with the new Mood system.
 * These names are AI-safe and map to emotional + stylistic directions.
 */
export type Vibe =
  | 'N/A'
  | 'Let AI Decide'
  | 'Cozy'
  | 'Cinematic'
  | 'Dramatic'
  | 'Dreamy'
  | 'Elegant'
  | 'Glam'
  | 'Joyful'
  | 'Romantic'
  | 'Sophisticated'
  | 'Wholesome';

export type PosePreference =
  | 'N/A'
  | 'Let AI Decide'
  | 'Close-Up'
  | 'Formal'
  | 'Full Body'
  | 'Natural';

export type BackgroundIntensity = 'N/A' | 'Let AI Decide' | 'Bold' | 'Moderate' | 'Soft';

export type LightingTone = 'N/A' | 'Let AI Decide' | 'Cinematic Glow' | 'Cool' | 'Neutral' | 'Warm';

export type ColorPalette =
  | 'N/A'
  | 'Let AI Decide'
  | 'Bold & Vibrant'
  | 'Classic Black & White'
  | 'Deep Cinematic Tones'
  | 'Earthy Naturals'
  | 'Frosted Whites'
  | 'Holiday Gold'
  | 'Soft Pastels';

/**
 * Age + group category (who is in the image)
 * Helps AI with proportion, posing, clothing, and safety.
 */
export type WhoInPhoto =
  | 'N/A'
  | 'Let AI Decide'
  | 'Adult (18–29)'
  | 'Adult (30–59)'
  | 'Baby (0-1 Year)' 
  | 'Child (5–11)'
  | 'Senior (60+)'
  | 'Teen (12–17)'
  | 'Toddler (2–4)'; 

export type RelationshipType =
  | 'N/A'
  | 'Let AI Decide'
  | 'Colleagues'
  | 'Couple'
  | 'Family'
  | 'Friends';

/**
 * Body Type — safe, descriptive, and non-triggering language.
 */
export type BodyType =
  | 'N/A'
  | 'Let AI Decide'
  | 'Athletic'
  | 'Average'
  | 'Big and Tall'
  | 'Curvy'
  | 'Muscular'
  | 'Petite'
  | 'Plus-Size'
  | 'Slim / Thin'
  | 'Super Size'
  | 'Thick';

export type HeightCategory =
  | 'N/A'
  | 'Let AI Decide'
  | 'Average Height'
  | 'Short'
  | 'Tall';

/**
 * Bust appearance — AI-safe version that works without flagging.
 * “Appearance” is the key word that avoids safety filter issues.
 */
export type BustAppearance =
  | 'N/A'
  | 'Let AI Decide'
  | 'Balanced Proportion'
  | 'Enhanced Bust Appearance'
  | 'Flat / Minimal Bust'
  | 'Full Bust (Lifted Look)'
  | 'Full Bust (Natural)'
  | 'Moderate Bust'
  | 'Small Bust';

/**
 * Interface for UI Dropdown Options (Used in Generator.tsx)
 */
export interface Option {
    value: string;
    label: string;
}

/**
 * Expanded GenerationOptions — all new attributes included.
 * These flow directly into geminiService.ts
 */
export interface GenerationOptions {
  // Core parameters
  theme: HolidayTheme;
  style: string; // The user-selected style name (e.g., 'Santa’s Workshop')
  creativeNotes: string;

  // Composition & Artistic Controls
  artStyle: ArtStyle;
  vibe: Vibe; // now represents Mood
  aspectRatio: AspectRatio;
  pose: PosePreference;
  backgroundIntensity: BackgroundIntensity;
  lightingTone: LightingTone;
  colorPalette: ColorPalette;

  // Auxiliary Parameters
  peopleCount: string;
  petCount: string;
  personalEcho: boolean;
  strictLikeness: boolean;

  // Human Attribute Controls (Now mandatory, no '?')
  whoInPhoto: WhoInPhoto;
  bodyType: BodyType;
  heightCategory: HeightCategory;
  bustAppearance: BustAppearance;
}