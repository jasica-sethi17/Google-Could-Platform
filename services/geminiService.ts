
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Character } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const characterSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The unique name of the fantasy character.',
    },
    characterClass: {
      type: Type.STRING,
      description: 'The class of the character, chosen from the provided list.',
    },
    health: {
      type: Type.NUMBER,
      description: 'The health points of the character, as an integer between 100 and 200.',
    },
    mana: {
      type: Type.NUMBER,
      description: 'The mana points of the character, as an integer between 50 and 150.',
    },
    strength: {
      type: Type.NUMBER,
      description: 'The strength score of the character, as an integer between 10 and 25.',
    },
  },
  required: ['name', 'characterClass', 'health', 'mana', 'strength'],
};

export async function generateFantasyCharacter(): Promise<Omit<Character, 'id'>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a random fantasy character with a unique name, a class, and stats. The class should be one of: Mage, Rogue, Warrior, Cleric, Ranger, Paladin, or Druid. Health should be between 100-200, Mana between 50-150, and Strength between 10-25.",
      config: {
        responseMimeType: "application/json",
        responseSchema: characterSchema,
      },
    });

    const text = response.text.trim();
    const characterData = JSON.parse(text);

    if (
      typeof characterData.name === 'string' &&
      typeof characterData.characterClass === 'string' &&
      typeof characterData.health === 'number' &&
      typeof characterData.mana === 'number' &&
      typeof characterData.strength === 'number'
    ) {
      return characterData as Omit<Character, 'id'>;
    } else {
      throw new Error('Invalid character data format received from API.');
    }
  } catch (error) {
    console.error("Error generating character:", error);
    throw new Error("Failed to generate character. Please check the API key and try again.");
  }
}

export async function generateCharacterPortrait(character: Character): Promise<string> {
    try {
        const prompt = `A vibrant, cartoon/video game style portrait of a fantasy character.
        Name: ${character.name}
        Class: ${character.characterClass}
        Style: Bright colors, clean lines, expressive, fantasy art style.
        View: Head and shoulders portrait.
        Background: Simple, abstract, fantasy-themed background that complements the character.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error('No image data found in the API response.');

    } catch (error) {
        console.error("Error generating character portrait:", error);
        throw new Error("Failed to generate portrait. The artistic muses are unavailable.");
    }
}

export async function generateCharacterBackstory(character: Character): Promise<string> {
    try {
        const prompt = `Generate a unique, one-to-two-sentence fantasy origin story for a character. The story should be mysterious and intriguing.
        
        Character Name: ${character.name}
        Class: ${character.characterClass}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating character backstory:", error);
        throw new Error("Failed to generate backstory. The chronicles are incomplete.");
    }
}