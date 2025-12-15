import { GenerationOptions, ReferenceImage } from './types';

// Cloud Run backend URL
const BACKEND_URL = 'https://holiday-magic-studio-633379690324.us-west1.run.app';

export const generateImage = async (
  options: GenerationOptions,
  referenceImages: ReferenceImage[] = []
): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        options,
        referenceImages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const data = await response.json();
    
    if (data.success && data.imageData) {
      return data.imageData;
    }
    
    throw new Error('No image data in response');
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please check your prompt or reference images and try again.');
  }
};

// Placeholder functions for analyze and edit - not implemented yet
export const analyzeImage = async (imageDataUrl: string, mimeType: string): Promise<string> => {
  throw new Error('Analyze feature not implemented yet');
};

export const editImage = async (
  imageDataUrl: string, 
  mimeType: string, 
  prompt: string, 
  referenceImages: ReferenceImage[] = []
): Promise<string> => {
  throw new Error('Edit feature not implemented yet');
};
