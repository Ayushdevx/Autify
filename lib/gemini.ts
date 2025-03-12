import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyDr70g0d39fLfstWQnpCRK6UFaxJZVbiwk';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getRecommendations(userPreferences: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `As a music recommendation expert, suggest 5 songs based on these preferences: ${userPreferences}. 
    Format the response as a JSON array with objects containing title and artist. 
    Keep it focused on popular and well-known songs that are likely to be found on YouTube.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      // If JSON parsing fails, return an empty array
      return [];
    }
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
}