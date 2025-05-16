import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = "AIzaSyCktCapPp_I47hwmKRK4fls-BbGgWBwB7k";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // You can also use "gemini-pro"
    });

    const result = await model.generateContent(prompt); // ✅ CORRECT METHOD
    const text = result.response.text(); // ✅ Extract text safely

    return NextResponse.json({ text });
  } catch (error) {
    console.error("❌ Gemini error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
