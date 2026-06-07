import { GoogleGenAI } from "@google/genai";

function buildPrompt(mode, input, tone, target) {
  if (mode === "summarize") {
    return `
Summarize the following text into a maximum of 5 bullet points:

${input}
`;
  }

  if (mode === "rewrite") {
    return `
Rewrite the following text in a ${tone || "simple"} tone.
Preserve the original meaning.

${input}
`;
  }

  return `
Translate the following text to ${target || "Tamil"}.

Rules:
- Keep names unchanged.
- Keep product names unchanged.
- Preserve the original meaning.
- Return only the translated text.

${input}
`;
  }


export async function POST(req) {
  try {
    const { input, mode, tone, target } = await req.json();

    const cleanedInput = input?.trim();

    if (!cleanedInput) {
      return Response.json(
        { error: "Text required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = buildPrompt(
      mode,
      cleanedInput,
      tone,
      target
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return Response.json({
      output: response.text,
    });
  } catch (err) {
    console.error("Gemini Error:", err);

    return Response.json(
      {
        error: err.message || "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}