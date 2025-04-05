import { GenerateEmailTemplateAIModel } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = await GenerateEmailTemplateAIModel.sendMessage(prompt);
    const aiResp = await result.response.text(); // Await the response text

    console.log(aiResp, "airesponse"); // Log the AI response
    return new NextResponse(aiResp, { status: 200 }); // Correctly return response
  } 
  catch (e) {
    console.error("Error generating email:", e);
    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    ); // Proper error handling
  }
}