
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSymptoms = async (description: string, images?: string[]) => {
  const parts: any[] = [{ text: `Analyze the following patient symptoms and provide a structured summary. Suggest potential medical departments the patient should consult. Current description: ${description}` }];
  
  if (images && images.length > 0) {
    images.forEach(img => {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(',')[1]
        }
      });
    });
  }

  // Using gemini-3-pro-preview for complex medical reasoning tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          suggestedSpecialties: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          preliminaryObservations: { type: Type.STRING },
          urgencyLevel: { type: Type.STRING }
        },
        required: ["summary", "suggestedSpecialties", "preliminaryObservations", "urgencyLevel"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const draftDiagnosis = async (caseDescription: string, symptoms: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a medical assistant helping a doctor, draft a professional diagnosis and recommendation for the following case description: "${caseDescription}" with symptoms: ${symptoms.join(', ')}. Focus on professional medical terminology.`,
    config: {
      temperature: 0.2,
      systemInstruction: "You are a highly skilled medical assistant drafting reports for verified physicians."
    }
  });

  return response.text;
};
