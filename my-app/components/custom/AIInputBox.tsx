"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import axios from "axios";
import { AIPrompt } from "@/Data/Prompt";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function AIInputBox() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const OnGenerate = async () => {
    if (!userInput.trim()) return; // Prevent empty submissions

    const PROMPT = `${AIPrompt.EMAIL_PROMPT}\n- ${userInput}`; // Combine the prompt with user input
    const templateId = uuidv4(); // Generate a new UUID for the template
    setLoading(true);

    try {
      // Call your AI model API to generate the email content
      const result = await axios.post("/api/generate-email", {
        prompt: PROMPT,
      });
      const aiContent = result.data; // { text: "```json\n[...]\n```" }
      // Assume it returns the generated content

      let rawText = aiContent.text.trim();

      // Remove markdown formatting if it exists
      if (rawText.startsWith("```json")) {
        rawText = rawText
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
      }

      let parsedContent;
      try {
        parsedContent = JSON.parse(rawText);
      } catch (err) {
        console.error("❌ Failed to parse AI response text:", err, rawText);
        return;
      }

      const query = new URLSearchParams({
        content: JSON.stringify(parsedContent), // Only pass the actual template blocks
      }).toString();

      router.push(`/editor/${templateId}?${query}`);
    } catch (e) {
      console.error("Error generating email:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <p className="mb-2">
        Provide details about the email template you'd like to create
      </p>
      <Textarea
        className="text-xl min-h-[180px] resize-y w-full p-3 border rounded-lg"
        placeholder="Start Writing Here..."
        rows={3}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <Button
        className="w-full mt-7"
        disabled={userInput.trim().length === 0 || loading}
        onClick={OnGenerate}
      >
        {loading ? (
          <span className="flex gap-2">
            <Loader2 className="animate-spin" /> Please Wait...
          </span>
        ) : (
          "GENERATE"
        )}
      </Button>
    </div>
  );
}

export default AIInputBox;
