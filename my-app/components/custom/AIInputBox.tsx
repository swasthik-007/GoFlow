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
      const result = await axios.post("/api/ai-email-generate", {
        prompt: PROMPT,
      });
      const aiContent = result.data; // Assume it returns the generated content

      console.log(aiContent); // Log the AI response for debugging

      // Redirect to the editor page with the generated content as a query parameter
      const query = new URLSearchParams({
        content: JSON.stringify(aiContent),
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
