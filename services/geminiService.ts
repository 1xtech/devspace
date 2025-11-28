import { GoogleGenAI } from "@google/genai";
import { GeminiModel, DbSchema } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDatabaseSchema = async (requirements: string): Promise<DbSchema> => {
  if (!apiKey) return { sql: '-- API Key not found', explanation: 'Please configure your API key.' };

  try {
    const prompt = `
      You are a senior database architect. 
      Create a systematic, normalized database schema (SQL) for the following requirement: "${requirements}".
      
      Format the response as JSON with two fields:
      1. "sql": The SQL CREATE TABLE statements.
      2. "explanation": A brief, professional explanation of the structure and relationships.
      
      Ensure the SQL is clean and uses consistent naming conventions (snake_case).
    `;

    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DbSchema;
  } catch (error) {
    console.error("Gemini DB Gen Error:", error);
    return {
      sql: '-- Error generating schema',
      explanation: 'An error occurred while contacting the AI service.'
    };
  }
};

export const suggestTasks = async (projectDescription: string): Promise<string[]> => {
  if (!apiKey) return ["Configure API Key to use AI"];

  try {
    const prompt = `
      You are a project manager. Break down the following software project into 5-7 high-level, actionable technical tasks: "${projectDescription}".
      Return ONLY a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Task Gen Error:", error);
    return ["Could not generate tasks. Try again."];
  }
};

export const explainCode = async (code: string): Promise<string> => {
  if (!apiKey) return "Please configure API Key.";
  if (!code.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Explain this code snippet briefly and professionally:\n\n${code}`,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    return "Error explaining code.";
  }
};