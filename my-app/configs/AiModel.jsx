// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } = require("@google/generative-ai");
//   const fs = require("node:fs");
//   const mime = require("mime-types");
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { User } from "@clerk/nextjs/server";
// import fs from "fs";
// import mime from "mime-types";
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
  ],
  responseMimeType: "application/json",
};

export const GenerateLayout_AI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "The user will specify the recipient type, the desired tone, and the purpose of the email. Ensure the email is appropriate for the recipient, maintaining the specified tone throughout. If the email is formal, use professional language and structure. If it's friendly, keep it conversational and engaging. Include a proper greeting and closing relevant to the chosen tone. If the user provides key points, make sure to incorporate them naturally. The email should be concise yet effective, conveying the intended message clearly while maintaining a smooth flow. Avoid redundancy and ensure grammatical correctness. Format the email in paragraphs for readability, and make it sound natural as if written by a human. produce in JSON format." },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "Okay, I understand. I'm ready. Please provide the following information so I can generate the JSON for your email:\n\n*   **Recipient Type:** (e.g., Boss, Colleague, Client, Friend, Family Member, Professor)\n*   **Desired Tone:** (e.g., Formal, Informal, Friendly, Urgent, Apologetic, Encouraging, Humorous, Neutral)\n*   **Purpose of the Email:** (e.g., Request Information, Schedule Meeting, Offer Help, Express Gratitude, Deliver Bad News, Provide an Update, Make an Introduction)\n*   **Key Points to Include:** (List the key points as bullet points. Be as specific as possible.)\n*   **Any other relevant details or context:** (e.g., Specific deadlines, prior communication, specific subject matter)\n\nOnce you provide this information, I will generate the JSON output containing the email text.\n" },
      ],
    },
    {
      role: "user",
      parts: [
        { text: "generate :\nrecipient type:Friend , Desired Tone is friendly  , purpose: Congrats him for his marraige , key points : I am not able to attend  " },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n{\n  \"email\": {\n    \"subject\": \"Huge Congrats on the Wedding!\",\n    \"body\": \"Hey [Friend's Name],\\n\\nJust heard the amazing news about your wedding – HUGE congratulations! I'm so incredibly happy for you and [Spouse's Name]. Wishing you both a lifetime of happiness together!\\n\\nI'm really bummed to say that I won't be able to make it to the wedding. I'm so sorry to miss celebrating with you in person. [ Briefly explain why you can't attend, e.g., \\\"I've got a prior commitment that I just can't get out of.\\\"]\\n\\nEven though I can't be there, please know that I'll be thinking of you both and raising a glass to your happiness from afar. I'd love to catch up soon when things settle down and hear all about it!\\n\\nAgain, huge congratulations! All the best for a wonderful wedding day and a fantastic future together.\\n\\nBest,\\n[Your Name]\"\n  }\n}\n```" },
      ],
    },

  ],
});
// export const GenerateLayout_AI_1 = model.startChat({
//   generationConfig,
//   history: [
//     {
//       role: "user",
//       parts: [
//         {
//           text: "The user will specify the recipient type, the desired tone, and the purpose of the email. Ensure the email is appropriate for the recipient, maintaining the specified tone throughout. Format it properly and make it natural.",
//         },
//       ],
//     },
//     {
//       role: "model",
//       parts: [
//         {
//           text: "Understood! Please provide:\n- **Recipient Type** (e.g., Boss, Colleague, Friend)\n- **Tone** (e.g., Formal, Friendly)\n- **Purpose** (e.g., Congrats, Apology)\n- **Key Points**",
//         },
//       ],
//     },
//   ],
// });




// Query Past Emails
// export const QueryEmails_AI = async (query, recipient) => {
//   try {
//     // Fetch emails from backend
//     const EMAIL_DB_URL = "http://localhost:5000/emails";
//     const response = await fetch(EMAIL_DB_URL);
//     const emails = await response.json();

//     // Filter emails by recipient if specified
//     const filteredEmails = recipient
//       ? emails.filter((email) => email.from.includes(recipient) || email.subject.includes(recipient))
//       : emails;

//     // Prepare context
//     const emailContext = filteredEmails
//       .map((email) => `From: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}`)
//       .join("\n\n");

//     // Query Gemini
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [
//         {
//           role: "user", parts: [{
//             text: `Here are past emails:\n\n${emailContext}\n\nNow answer my query: ${query}`,
//           },
//           ],
//         },
//       ],
//     });

//     const result = await chatSession.sendMessage(query);
//     return result.response.text();
//   } catch (error) {
//     console.error("Error querying emails:", error);
//     return "Error processing your request.";
//   }
// };


// Query Past Emails
export const QueryEmails_AI = async (query, recipient) => {
  try {
    // Fetch emails from backend
    const EMAIL_DB_URL = "http://localhost:5000/emails";
    const response = await fetch(EMAIL_DB_URL);
    const emails = await response.json();

    // Filter emails by recipient if specified
    let filteredEmails = emails;

    if (recipient && recipient.trim() !== '') {
      const recipientLower = recipient.toLowerCase().trim();
      filteredEmails = emails.filter(
        (email) => email.from.toLowerCase().includes(recipientLower)
      );

      // If no emails from this recipient, return an appropriate message
      if (filteredEmails.length === 0) {
        return `No emails found from ${recipient}. Please check the recipient name or try a different query.`;
      }
    }

    // Prepare context
    const emailContext = filteredEmails
      .map((email) => `From: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}`)
      .join("\n\n");

    // Query Gemini
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{
            text: `Here are past emails${recipient ? ' from ' + recipient : ''}:\n\n${emailContext}\n\nNow answer my query: ${query}`,
          }],
        },
      ],
    });

    const result = await chatSession.sendMessage(query);
    return result.response.text();
  } catch (error) {
    console.error("Error querying emails:", error);
    return "Error processing your request.";
  }
};



export const refineMessage = async (message) => {
  // console.log("Original Message:", message);
  try {
    // Extract only the email body for refinement
    // const bodyMatch = message.match(/\*\*Refined Email Options:\*\*([\s\S]*)/);

    // if (!bodyMatch) {
    //   throw new Error("Invalid email format. Ensure it contains proper formatting.");
    // }

    const emailBody = message.trim(); // Extract only body content

    // Send only the body for refinement
    const response = await model.generateContent({
      contents: [{ role: "refine", parts: [{ text: `Refine this email body: ${emailBody}` }] }],
    });
    console.log("Original Message:", emailBody);

    const refinedBody = response.response.candidates[0].content.parts[0].text;
    console.log("Refined Body:", refinedBody);

    // Return refined body only
    return refinedBody;
  } catch (error) {
    console.error("AI Refinement Error:", error);
    throw new Error("Failed to refine message");
  }
};






// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
