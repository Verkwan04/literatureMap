import { GoogleGenAI, Type, SchemaShared } from "@google/genai";
import { BookLocation, AISettings, AIProvider } from "../types";

const SYSTEM_PROMPT = `
You are a literary historian and cartographer. 
Your task is to find at least 10 real-world locations in a specific city that are significantly featured in famous literature.
Ensure the locations are real, precise, and the literary connection is authentic.

For each landmark, return a JSON object containing both English ('en') and Chinese ('zh') translations.
Required fields:
1. name (en/zh) - The real name of the landmark.
2. bookTitle (en/zh) - The book it appears in.
3. author (en/zh) - The author.
4. quote (en/zh) - A relevant, famous quote describing this spot (approximate if exact is not available).
5. travelerNote (en/zh) - A helpful tip for a literary tourist visiting today.
6. lat (number) - Latitude.
7. lng (number) - Longitude.

Return strictly a JSON array of objects. Do not include markdown code blocks.
`;

const USER_PROMPT = (city: string) => `Find at least 10 literary landmarks in "${city}".`;

// Gemini Implementation
async function fetchGemini(city: string, apiKey: string): Promise<BookLocation[]> {
  const ai = new GoogleGenAI({ apiKey });
  
  const schema: SchemaShared = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } } },
        bookTitle: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } } },
        author: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } } },
        quote: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } } },
        travelerNote: { type: Type.OBJECT, properties: { en: { type: Type.STRING }, zh: { type: Type.STRING } } },
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
      },
      required: ['name', 'bookTitle', 'author', 'quote', 'travelerNote', 'lat', 'lng'],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: USER_PROMPT(city),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }], // Use Google Search for ground truth
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini search failed. Please check your API key.");
  }
}

// OpenAI / DeepSeek Implementation (Compatible Interfaces)
async function fetchOpenAICompatible(city: string, apiKey: string, baseUrl: string, model: string): Promise<BookLocation[]> {
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + " Output strictly raw JSON." },
          { role: 'user', content: USER_PROMPT(city) }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API request failed');
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean markdown code blocks if present
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
}

export const findLiteraryLocations = async (city: string, settings: AISettings): Promise<BookLocation[]> => {
  let locations: BookLocation[] = [];

  switch (settings.provider) {
    case 'gemini':
      if (!settings.geminiKey) throw new Error("Gemini API Key is missing.");
      locations = await fetchGemini(city, settings.geminiKey);
      break;
    case 'openai':
      if (!settings.openaiKey) throw new Error("OpenAI API Key is missing.");
      locations = await fetchOpenAICompatible(city, settings.openaiKey, 'https://api.openai.com/v1', 'gpt-4o');
      break;
    case 'deepseek':
      if (!settings.deepseekKey) throw new Error("DeepSeek API Key is missing.");
      locations = await fetchOpenAICompatible(city, settings.deepseekKey, 'https://api.deepseek.com', 'deepseek-chat');
      break;
  }

  // Enrich with visual IDs and mock covers (since we can't generate real covers easily without image gen API cost/complexity)
  return locations.map((loc, index) => ({
    ...loc,
    id: `ai-${settings.provider}-${city}-${index}`,
    coverUrl: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`,
  }));
};
