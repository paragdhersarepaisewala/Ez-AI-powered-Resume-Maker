import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function structureResumeData(
  unstructuredText: string,
  jobDescription?: string
): Promise<Partial<ResumeData['aiContent']>> {
  const jobContextBlock = jobDescription?.trim()
    ? `\n      JOB DESCRIPTION (tailor the resume to this role, mirror its keywords and language):\n      ${jobDescription.trim()}\n      `
    : '';

  const keywordInstruction = jobDescription?.trim()
    ? `- Keyword Matching: Mirror the exact keywords, tools, and phrases from the Job Description in skills, summary, and experience descriptions. ATS systems scan for these exact matches.`
    : `- Skills: Each skill name MUST be 2-3 words maximum.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following unstructured resume information into a structured JSON format.
      ${jobContextBlock}
      CRITICAL INSTRUCTION: You MUST ensure the content fits perfectly on a single A4 page.
      - Profile Summary/Bio: MUST be between 40 and 50 words. ${jobDescription?.trim() ? 'Tailor it to the job description using the same terminology.' : ''}
      - Work Experience: If there are multiple experiences, limit each to exactly 20 words. If there is only one, limit it to 40 words. Focus on measurable impact and key responsibilities.
      ${keywordInstruction}
      - Education, Goals, Hobbies, and other details: Limit each entry to 10-20 words.
      - Portfolio & Links: If the user provides links (e.g., Portfolio, GitHub, LinkedIn), you MUST create a Custom Section with the title 'Links' or 'Portfolio' and list them in the content.
      
      You MUST return ONLY a valid JSON object matching this exact structure, with no markdown formatting:
      {
        "summary": "A professional summary or objective",
        "goals": "Career goals",
        "education": [{ "institution": "string", "degree": "string", "startDate": "string", "endDate": "string", "description": "string" }],
        "experience": [{ "company": "string", "position": "string", "startDate": "string", "endDate": "string", "description": "string" }],
        "skills": [{ "name": "string", "level": 5 }],
        "hobbies": ["string"],
        "customSections": [{ "id": "string", "title": "string", "content": "string" }]
      }
      
      If the user provides too much information, shorten and summarize it while remaining descriptive. If they provide too little, professionally expand it to meet these specific word counts.
      Maintain a professional, high-end tone throughout.
      
      Information: ${unstructuredText}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(rawText);
  } catch (e) {
    console.error("Failed in Gemini API / parsing:", e);
    return {};
  }
}
