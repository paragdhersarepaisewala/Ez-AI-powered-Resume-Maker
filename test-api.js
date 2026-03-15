import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
    console.log("Testing API...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello, world! Respond with 'hi'.",
        });
        console.log("Response:", response.text);
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
