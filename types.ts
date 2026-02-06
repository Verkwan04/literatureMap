export type LocalizedText = {
  en: string;
  zh: string;
};

export interface BookLocation {
  id: string;
  name: LocalizedText; // Landmark name
  lat: number;
  lng: number;
  bookTitle: LocalizedText;
  author: LocalizedText;
  quote: LocalizedText;
  travelerNote: LocalizedText;
  coverUrl?: string;
  // Additional groundings
  reviews?: string[];
  googleMapsUri?: string;
}

export interface CityData {
  name: LocalizedText;
  lat: number;
  lng: number;
  locations: BookLocation[];
}

// Removed Darkroom mode
export enum AppMode {
  MAP = 'MAP',
}

export type Language = 'en' | 'zh';

export type AIProvider = 'gemini' | 'openai' | 'deepseek';

export interface AISettings {
  provider: AIProvider;
  geminiKey: string;
  openaiKey: string;
  deepseekKey: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        reviewText: string;
      }[];
    }[];
  };
}