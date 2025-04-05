import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DOMPurify from "dompurify";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "../globals.css";
import { Sparkles, Check } from "lucide-react";
import { useCompose } from "@/context/ComposeContext";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const ChatBot = () => {
  const [recipient, setRecipient] = useState("");
  const [query, setQuery] = useState(""); // Now used for AI-generated reply too
  const [emails, setEmails] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isAskAI, setIsAskAI] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  const { user } = useUser();
  const loggedInEmail = user?.primaryEmailAddress?.emailAddress || "";
  const textareaRef = useRef(null);
  const { isComposeOpen, isQuickComposeOpen, isLoading, setIsLoading } =
    useCompose();

  useEffect(() => {
    if (recipient.trim()) {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(fetchEmails, 1000));
    }
  }, [recipient]);

  const fetchEmails = async () => {
    if (!recipient.trim()) return;
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/emails");
      const recipientLower = recipient.trim().toLowerCase();
      const filteredEmails = res.data.filter(
        (email) =>
          email.from.toLowerCase().includes(recipientLower) ||
          email.to.toLowerCase().includes(recipientLower) ||
          email.body.toLowerCase().includes(recipientLower)
      );

      setEmails(filteredEmails);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
    setIsLoading(false);
  };

  const handleQuery = async () => {
    if (!query.trim() || emails.length === 0) return;

    // Filter emails from the specific recipient
    const recipientEmail = recipient.trim();
    const recipientEmails = emails.filter((email) =>
      email.from.toLowerCase().includes(recipientEmail.toLowerCase())
    );

    // If no emails from this recipient, show an alert and return
    if (recipientEmails.length === 0) {
      alert("No emails found from this recipient to analyze.");
      return;
    }

    // Create context only from the emails from this recipient
    const emailContext = recipientEmails
      .map(
        (email) =>
          `From: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}`
      )
      .join("\n\n");

    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Emails:\n${emailContext}\n\nQuery: ${query}` }],
        },
      ],
    });

    const aiResponse = await chatSession.sendMessage(query);
    setQuery(aiResponse.response.text()); // Now shows in input box
  };

  const generateReply = async () => {
    if (emails.length === 0 || !loggedInEmail) return;

    const latestEmail = emails[0];

    if (latestEmail.from.toLowerCase() === loggedInEmail.toLowerCase()) {
      alert("Skipping reply: The last email was sent by you.");
      return;
    }

    const recentEmails = emails
      .slice(0, 4)
      .map(
        (email, index) => `
        Email ${index + 1} (Newest First):
        From: ${email.from}
        Subject: ${email.subject}
        Body: ${email.body}
    `
      )
      .join("\n\n");

    const replyPrompt = `
    Generate a professional, polite, and relevant reply:
    1. Acknowledge the recipient's response, showing appreciation for the information provided.
    2. Maintain an appropriate tone based on sentiment.
    3. Address the extracted query directly.
    4. Even if the query has been answered or fulfilled, ask for **additional details** or **clarifications** to continue the conversation.
    5. The response should be **from ${loggedInEmail}** as a **reply to the recipient**.
    6. Keep the response **professional**, **polite**, and **concise**.
    7. Suggest next steps or ask a relevant follow-up question.

    Recent Emails:
    ${recentEmails}
    `;

    const replySession = model.startChat({
      history: [{ role: "user", parts: [{ text: replyPrompt }] }],
    });

    const replyResponse = await replySession.sendMessage(replyPrompt);
    setQuery(replyResponse.response.text()); // Place AI reply in input box
  };

  const refineText = async () => {
    if (!query.trim()) return;

    setIsRefining(true);

    try {
      const refinePrompt = `
      Please refine the following email text to correct any spelling errors, improve vocabulary, 
      enhance grammar, and make it more professional while maintaining the original meaning and tone:
      
      "${query}"
      
      Return only the corrected text without explanations or additional comments.
      `;

      const refineSession = model.startChat({
        history: [{ role: "user", parts: [{ text: refinePrompt }] }],
      });

      const refinedResponse = await refineSession.sendMessage(refinePrompt);
      setQuery(refinedResponse.response.text().trim());
    } catch (error) {
      console.error("Error refining text:", error);
      alert("Error refining text. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const sendReply = async () => {
    if (!query.trim() || emails.length === 0) return;

    // Get the recipient from the input field
    const recipientEmail = recipient.trim();

    // Find emails from this recipient
    const recipientEmails = emails.filter((email) =>
      email.from.toLowerCase().includes(recipientEmail.toLowerCase())
    );

    // If no emails from this recipient, show an alert and return
    if (recipientEmails.length === 0) {
      alert("No emails found from this recipient to reply to.");
      return;
    }

    // Use the latest email from this recipient
    const latestEmail = recipientEmails[0];

    const emailPayload = {
      to: latestEmail.from,
      subject: `${latestEmail.subject}`,
      body: query, // Sends the edited or AI-generated reply
    };

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        console.error("Error sending email:", await response.text());
        return;
      }

      alert("Email sent successfully! ✅"); // Show alert
      setQuery(""); // Clear input box
      console.log("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleToggle = async () => {
    setIsAskAI((prev) => {
      // Clear the query when toggling
      setQuery("");

      if (prev === true) {
        generateReply(); // Generate reply when switching to "Reply"
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // Set new height
    }
  }, [query]);

  useEffect(() => {
    // Clear the query whenever recipient changes
    setQuery("");
  }, [recipient]);

  useEffect(() => {
    <p className="bg-gradient-to-br from-green-400 to-blue-600 animate-pulse">
      Fetching emails...
    </p>;
    setQuery("");
  }, [emails]);

  return (
    <div
      className={`r-0 pr-6 pl-6 pt-2 dark:bg-gray-900 dark:text-white rounded-sm w-full h-screen ${
        isQuickComposeOpen || isComposeOpen ? "hidden" : ""
      }`}
    >
      <h1 className="text-2xl  flex items-center text-center ml-20 font-bold mb-4">
        AI Email Assistant
      </h1>
      {/* <img src="chat1.png" alt="" className="w-20 h-20" /> */}

      <div className="relative w-full">
        <h2 className="text-xl font-semibold mb-2">Looking For:</h2>
        <input
          id="hs-floating-input-email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder=" "
          className="peer p-2 block w-full border border-gray-900 dark:border-neutral-700 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:text-neutral-400 dark:focus:ring-neutral-600
    focus:pt-6 focus:pb-2 "
        />
      </div>
      {emails.length > 0 ? (
        <p className="text-green-600 font-medium">
          {emails.length} emails found ✅
        </p>
      ) : (
        ""
      )}
      <div className="mb-6 ">
        <h3 className="text-xl font-semibold mt-2 mb-2">
          Emails from {recipient}:
        </h3>

        <ul
          className={`overflow-y-auto overflow-x-hidden border p-3 rounded-lg shadow-md w-full
  ${emails.length > 0 ? "max-h-[200px] min-h-[140px]" : "max-h-[100px]"}`}
        >
          {emails.length > 0 ? (
            emails.map((email) => (
              <li
                key={email.id}
                className="border-b py-3 last:border-b-0 w-full flex flex-col gap-1"
              >
                <strong className="text-lg text-blue-600 block w-full overflow-hidden text-ellipsis">
                  {email.subject}
                </strong>

                <div
                  className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words w-full
          text-sm bg-gray-100 p-2 rounded shadow-sm"
                  style={{
                    overflowY: "auto",
                    overflowX: "hidden",
                    wordBreak: "break-word",
                    fontSize: "0.9rem",
                    maxWidth: "100%",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(email.body),
                  }}
                />
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No emails found.</p>
          )}
        </ul>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full border p-3 mb-4 rounded-xl shadow-md
    resize-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200
    border-gray-300 dark:border-gray-600 focus:outline-none 
    focus:ring-2 focus:ring-blue-500 transition-all duration-200 max-h-[180px] overflow-y-auto"
        placeholder={isAskAI ? "Ask AI about these emails..." : "Your reply..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <button
          className="bg-gradient-to-br from-green-400 to-blue-600 text-white px-4 py-2 rounded"
          onClick={isAskAI ? handleQuery : sendReply}
        >
          {isAskAI ? "Ask AI" : "Reply"}
        </button>

        {!isAskAI && (
          <button
            className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white px-4 py-2 rounded flex items-center"
            onClick={refineText}
            disabled={isRefining || !query.trim()}
          >
            {isRefining ? (
              <span className="flex items-center">Refining...</span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1" /> Refine
              </span>
            )}
          </button>
        )}

        <Switch
          checked={!isAskAI}
          onCheckedChange={handleToggle}
          className="ml-2"
        />
      </div>
    </div>
  );
};

export default ChatBot;
