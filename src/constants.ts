import {
  HolidayTheme,
  AspectRatio,
  ArtStyle,
  Vibe,
  PosePreference,
  BackgroundIntensity,
  LightingTone,
  ColorPalette,
  BodyType,
  HeightCategory,
  BustAppearance,
  WhoInPhoto,
  RelationshipType,
} from './types';

export const HOLIDAY_THEMES: HolidayTheme[] = [
  'All Holiday Styles',
  'Naughty or Nice', // New Theme
  'Baby\'s First Christmas (0-1 Year)', 
  'Christmas Ornament',
  'Celebration Glow (Universal)',
  'Christmas Magic',
  'Festival of Lights',
  'The Festive Gentleman', 
  'Winter Magic (Non-Religious)',
];

export const THEME_TO_STYLES: Record<HolidayTheme, string[]> = {
  none: [],

  'Naughty or Nice': [
      'Checking the List',
      'Caught Being Naughty',
      'Proudly Nice',
      'The List Keeper',
  ],

  'Baby\'s First Christmas (0-1 Year)': [
    'Baby Snow Globe',
    'Classic First Christmas Ornament',
    'Cozy Knit Pod Ornament',
    'Keepsake Frame Ornament',
    'Moon & Stars Ornament',
    'Pastel Wreath Ornament',
    'Vintage Swing Ornament',
  ],

  'The Festive Gentleman': [
    'Classic Dad Christmas',
    'Dapper Holiday Suit',
    'Midnight Velvet',
    'Modern Minimalist Man',
    'Rugged Winter Cabin',
  ],

  'Christmas Ornament': [
      'Baby\'s First Christmas', // Kept for legacy/fallback
      'Ceramic Bulb (Face Only)',
      'Glass Bauble (Full Body)',
      'Snow Globe Scene',
      'Snowflake (Face Only)',
      'Vintage Glass Ornament',
  ],

  'All Holiday Styles': [
    'Baby Snow Globe',
    'Black Velvet Couture',
    'Candlelit Portraits',
    'Caught Being Naughty', // New
    'Celebration Candle Wall',
    'Champagne Bokeh',
    'Checking the List', // New
    'Christmas & Cocoa', 
    'Cozy Cabin',
    'Cozy Knit Pod Ornament',
    'Elegant Gold Studio',
    'Gold + Blue Glow',
    'Holiday Gala',
    'Ice Palace',
    'Indoor Traditional',
    'Ivory Elegance',
    'Keepsake Frame Ornament',
    'Lux Christmas Couture',
    'Luxe Editorial Look',
    'Minimalist Festive Glow',
    'Moon & Stars Ornament',
    'Neutral Winter Studio',
    'Outdoor Traditional',
    'Pastel Wreath Ornament',
    'Proudly Nice', // New
    'Santa’s Workshop',
    'Snowy Outdoor',
    'Sparkling Lights Studio',
    'The List Keeper', // New
    'Vintage Swing Ornament',
    'Warm Lantern Scene',
    'Winter Royalty',
  ],

  'Celebration Glow (Universal)': [
    'Champagne Bokeh',
    'Elegant Gold Studio',
    'Ivory Elegance',
    'Luxe Editorial Look',
    'Minimalist Festive Glow',
  ],

  'Christmas Magic': [
    'Black Velvet Couture',
    'Christmas & Cocoa',
    'Holiday Gala',
    'Indoor Traditional',
    'Ivory Elegance',
    'Lux Christmas Couture',
    'Outdoor Traditional',
    'Santa’s Workshop',
  ],

  'Festival of Lights': [
    'Candlelit Portraits',
    'Celebration Candle Wall',
    'Gold + Blue Glow',
    'Sparkling Lights Studio',
    'Warm Lantern Scene',
  ],

  'Winter Magic (Non-Religious)': [
    'Cozy Cabin',
    'Ice Palace',
    'Neutral Winter Studio',
    'Snowy Outdoor',
    'Winter Royalty',
  ],
};

export const ART_STYLES: ArtStyle[] = [
  'N/A',
  'Let AI Decide',
  'Cinematic',
  'Editorial',
  'Lifestyle',
  'Photorealistic',
  'Storybook / Illustrated',
];

export const VIBES: Vibe[] = [
  'N/A',
  'Let AI Decide',
  'Cozy',
  'Cinematic',
  'Dramatic',
  'Dreamy',
  'Elegant',
  'Glam',
  'Joyful',
  'Romantic',
  'Sophisticated',
  'Wholesome',
];

export const POSE_PREFERENCES: PosePreference[] = [
  'N/A',
  'Let AI Decide',
  'Close-Up',
  'Formal',
  'Full Body',
  'Natural',
];

export const BACKGROUND_INTENSITIES: BackgroundIntensity[] = [
  'N/A',
  'Let AI Decide',
  'Bold',
  'Moderate',
  'Soft',
];

export const LIGHTING_TONES: LightingTone[] = [
  'N/A',
  'Let AI Decide',
  'Cinematic Glow',
  'Cool',
  'Neutral',
  'Warm',
];

export const COLOR_PALETTES: ColorPalette[] = [
  'N/A',
  'Let AI Decide',
  'Bold & Vibrant',
  'Classic Black & White',
  'Deep Cinematic Tones',
  'Earthy Naturals',
  'Frosted Whites',
  'Holiday Gold',
  'Soft Pastels',
];

export const WHO_IN_PHOTO: WhoInPhoto[] = [
  'N/A',
  'Let AI Decide',
  'Adult (18–29)',
  'Adult (30–59)',
  'Baby (0-1 Year)', 
  'Child (5–11)',
  'Senior (60+)',
  'Teen (12–17)',
  'Toddler (2–4)', 
];

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  'N/A',
  'Let AI Decide',
  'Colleagues',
  'Couple',
  'Family',
  'Friends',
];

export const BODY_TYPES: BodyType[] = [
  'N/A',
  'Let AI Decide',
  'Athletic',
  'Average',
  'Big and Tall',
  'Curvy',
  'Muscular',
  'Petite',
  'Plus-Size',
  'Slim / Thin',
  'Super Size',
  'Thick',
];

export const HEIGHT_CATEGORIES: HeightCategory[] = [
  'N/A',
  'Let AI Decide',
  'Average Height',
  'Short',
  'Tall',
];

export const BUST_APPEARANCES: BustAppearance[] = [
  'N/A',
  'Let AI Decide',
  'Balanced Proportion',
  'Enhanced Bust Appearance',
  'Flat / Minimal Bust',
  'Full Bust (Lifted Look)'
  , 'Full Bust (Natural)',
  'Moderate Bust',
  'Small Bust',
];

export const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: 'N/A', value: 'N/A' },
  { label: 'Let AI Decide (5:7)', value: 'Let AI Decide' },
  { label: '📷 Landscape (4:3)', value: '4:3' },
  { label: '🖼️ Post (3:4)', value: '3:4' },
  { label: '📸 IG/FB (1:1)', value: '1:1' },
  { label: '🎬 Cinematic (16:9)', value: '16:9' },
  { label: '📱 Story (9:16)', value: '9:16' },
];