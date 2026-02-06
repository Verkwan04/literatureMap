import { GoogleGenAI, Type } from "@google/genai";
import { BookLocation } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Searches for literary locations with bilingual results.
 * Model: gemini-3-flash-preview
 */
export const findLiteraryLocations = async (city: string): Promise<BookLocation[]> => {
  try {
    const prompt = `Find 4 specific, real-world landmarks in ${city} that are significantly featured in famous literature. 
    For each landmark, return a JSON object containing both English ('en') and Chinese ('zh') translations for text fields.
    
    Required fields:
    1. name (en/zh)
    2. bookTitle (en/zh)
    3. author (en/zh)
    4. quote (en/zh) - Famous quote
    5. travelerNote (en/zh) - 1 sentence tip
    6. lat (number)
    7. lng (number)
    
    Return ONLY a valid JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } },
                required: ['en', 'zh']
              },
              bookTitle: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } },
                required: ['en', 'zh']
              },
              author: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } },
                required: ['en', 'zh']
              },
              quote: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } },
                required: ['en', 'zh']
              },
              travelerNote: { 
                type: Type.OBJECT, 
                properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } },
                required: ['en', 'zh']
              },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
            },
            required: ['name', 'bookTitle', 'author', 'quote', 'travelerNote', 'lat', 'lng'],
          },
        },
      },
    });

    const locations = JSON.parse(response.text || '[]');
    
    // Enrich with IDs and placeholders
    return locations.map((loc: any, index: number) => ({
      ...loc,
      id: `gen-${city}-${index}`,
      coverUrl: `https://picsum.photos/200/300?random=${index + 100}`,
    }));

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

/**
 * Verifies and enriches location data using Gemini Maps Grounding.
 */
export const verifyLocationDetails = async (locationName: string, city: string): Promise<{ googleMapsUri?: string; reviews?: string[] }> => {
  try {
    const prompt = `Give me details for the landmark "${locationName}" in ${city}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let googleMapsUri = '';
    const reviews: string[] = [];

    // Extract Maps data
    for (const chunk of groundingChunks) {
        if (chunk.maps) {
            if (chunk.maps.uri) googleMapsUri = chunk.maps.uri;
            if (chunk.maps.placeAnswerSources) {
                chunk.maps.placeAnswerSources.forEach((source: any) => {
                   if (source.reviewSnippets) {
                       source.reviewSnippets.forEach((snippet: any) => {
                           if (snippet.reviewText) reviews.push(snippet.reviewText);
                       });
                   }
                });
            }
        }
    }

    return { googleMapsUri, reviews: reviews.slice(0, 2) }; // Limit reviews

  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return {};
  }
};

/**
 * Edits an image using text prompts.
 */
export const editVintageImage = async (base64Image: string, instruction: string): Promise<string | null> => {
  try {
    const prompt = `Edit this image: ${instruction}. Maintain the aspect ratio. Return the edited image.`;
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
            { text: prompt }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    return null;

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};
