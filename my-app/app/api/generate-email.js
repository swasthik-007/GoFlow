import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCktCapPp_I47hwmKRK4fls-BbGgWBwB7k";
const genAI = new GoogleGenerativeAI(apiKey);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseModalities: [],
      responseMimeType: "application/json",
    };

    try {
      const result = await model.generateText({
        prompt, // use directly
        ...generationConfig,
      });

      res.status(200).json({ text: result.text });
    } catch (error) {
      console.error("Error generating email:", error);
      res.status(500).json({ error: "Failed to generate email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
