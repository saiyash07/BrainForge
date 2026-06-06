import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// Initialize Gemini (Ensure GEMINI_API_KEY is in .env.local)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file." }, { status: 500 });
    }

    // Read the PDF file
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    // Use Gemini to generate the subject JSON
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert curriculum designer. 
      Analyze the following document text and structure it into a comprehensive study subject.
      You MUST return ONLY a valid JSON object matching the exact structure provided below, without any markdown formatting like \`\`\`json or \`\`\`.

      Structure required:
      {
        "id": "A unique, URL-safe slug starting with 'custom-' (e.g. 'custom-math-1')",
        "title": "A catchy title for the subject",
        "subtitle": "A brief 1-sentence subtitle",
        "icon": "A single emoji representing the subject",
        "color": "#HEXCOLOR",
        "colorLight": "rgba(r,g,b,0.15)",
        "gradient": "linear-gradient(135deg, #HEX1, #HEX2)",
        "modules": [
          {
            "id": "module-1",
            "title": "Module Title",
            "description": "Short description of the module",
            "topics": [
              {
                "id": "topic-1",
                "title": "Topic Title",
                "duration": 30,
                "content": "Detailed markdown content explaining the topic concepts. Use # headings, bullet points, and code blocks if applicable."
              },
              ... (add multiple topics per module)
              {
                "id": "practice-questions",
                "title": "Practice Questions",
                "duration": 45,
                "content": "Provide 10 practice questions relevant to this module. For each question, provide a solution hidden within HTML tags exactly like this: <details><summary>View Solution</summary>...solution here...</details>."
              }
            ]
          }
        ]
      }

      Document Text:
      ${text.substring(0, 30000)}
    `;

    const result = await model.generateContent(prompt);
    let jsonString = result.response.text().trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.slice(3, -3).trim();
    }

    const subjectData = JSON.parse(jsonString);

    // Save to Firestore
    await setDoc(doc(db, "subjects", subjectData.id), subjectData);

    return NextResponse.json({ success: true, subject: subjectData });
  } catch (error) {
    console.error("Error generating subject:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
