import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = "AIzaSyCktCapPp_I47hwmKRK4fls-BbGgWBwB7k";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const prompt = body.prompt;
    if (!prompt) {
      console.error("Missing prompt in request body");
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const result = await model.generateText({
      prompt,
      ...generationConfig,
    });

    console.log("Generated response:", result);
    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("❌ Error generating email:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
