import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
    console.log("Testing API with schema...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Parse this: John Doe is a software engineer with 5 years experience.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING }
                    }
                }
            }
        });
        console.log("Response:", response.text);
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
