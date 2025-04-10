import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Text transcription and analysis
export async function transcribeContent(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional documentation expert. Your task is to format, organize, and enhance the provided content to create well-structured, professional, educational material. Preserve all technical details while improving clarity and organization. Add section headers where appropriate.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    throw new Error(`Failed to transcribe content: ${error.message}`);
  }
}

// Audio transcription
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: new Blob([audioBuffer]),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error: any) {
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

// Generate structured knowledge content from unstructured input
export async function generateStructuredContent(rawContent: string): Promise<{
  title: string;
  sections: Array<{ heading: string; content: string }>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in organizing educational content. Transform the raw content into a well-structured educational format with a title and sections. Return JSON with the format: { 'title': string, 'sections': [{ 'heading': string, 'content': string }] }",
        },
        {
          role: "user",
          content: rawContent,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Untitled Content",
      sections: result.sections || [],
    };
  } catch (error: any) {
    throw new Error(`Failed to generate structured content: ${error.message}`);
  }
}
