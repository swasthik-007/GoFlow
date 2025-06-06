import { GenerateLayout_AI } from "@/configs/AiModel";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import DOMPurify from "dompurify";
// const { user } = useUser();
// const gmailId = user?.primaryEmailAddress?.emailAddress;
// import { GenerateLayout_AI }
// export const handleDelete = async (id, setEmails, setIsLoading, user) => {
//   const gmailId = user?.primaryEmailAddress?.emailAddress;
//   if (!gmailId) {
//     alert("User email not found.");
//     return;
//   }

//   if (!id) {
//     alert("Invalid email ID!");
//     return;
//   }

//   try {
//     setIsLoading(true);
//     const response = await axios.delete(
//       `https://goflow-9-jof0.onrender.com/emails/${id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${user?.primaryEmailAddress?.emailAddress}`,
//         },
//       }
//     );

//     if (response.status === 200) {
//       setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
//       alert("✅ Email deleted successfully!");
//     } else {
//       throw new Error("Server returned non-200 status");
//     }
//   } catch (error) {
//     console.error("❌ Error deleting email:", error);
//     alert(`Failed to delete email: ${error.message}`);
//   } finally {
//     setIsLoading(false);
//   }
// };
export const handleDelete = async (
  emailId,
  user,
  fetchEmails, // optional callback to refresh inbox
  setIsLoading // optional loading state handler
) => {
  if (!emailId) {
    alert("❌ Email ID is missing.");
    return;
  }

  const gmailId = user?.primaryEmailAddress?.emailAddress;
  if (!gmailId) {
    alert("❌ User email not found.");
    return;
  }

  try {
    if (setIsLoading) setIsLoading(true);

    const res = await axios.delete(
      `https://goflow-9-jof0.onrender.com/emails/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${gmailId}`,
        },
      }
    );

    alert(res.data.message || "✅ Email deleted!");
    if (fetchEmails) await fetchEmails(); // ✅ refresh list after delete
  } catch (error) {
    console.error("❌ Error deleting email:", error);
    alert(error.response?.data?.error || "Failed to delete email.");
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

export const fetchEmails = async (setEmails, setIsLoading, user) => {
  const gmailId = user?.primaryEmailAddress?.emailAddress;
  if (!gmailId) {
    console.log("❌ No Gmail ID. User not authenticated.");
    return;
  }

  try {
    setIsLoading(true);
    const response = await axios.get(
      "https://goflow-9-jof0.onrender.com/emails",
      {
        headers: {
          Authorization: `Bearer ${user?.primaryEmailAddress?.emailAddress}`,
        },
      }
    );

    setEmails(response.data);
  } catch (error) {
    console.error(
      "❌ Error fetching emails:",
      error.response?.data || error.message
    );
    alert("Failed to fetch emails. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

export const initializeTokenAndFetchEmails = (setToken, fetchEmails) => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromURL = urlParams.get("token");
  console.log("🔑 Token from URL:", tokenFromURL);

  if (tokenFromURL) {
    sessionStorage.setItem("oauth_token", tokenFromURL);
    setToken(tokenFromURL);
    fetchEmails(tokenFromURL);
    console.log("🔑 Token saved to session storage:", tokenFromURL);
  } else {
    const savedToken = sessionStorage.getItem("oauth_token");
    if (savedToken) {
      setToken(savedToken);
      fetchEmails(savedToken);
      console.log("🔑 Token retrieved from session storage:", savedToken);
    }
  }
};

export const handleRefine = async (body, setBody, setIsLoading) => {
  setIsLoading(true);

  const REFINEMENT_PROMPT = `Improve the following email body by checking spelling, enhancing clarity, and maintaining the original intent and tone while elaborating.
  
    Email Body:
    ${body}`;

  try {
    const result = await GenerateLayout_AI.sendMessage(REFINEMENT_PROMPT);
    const responseText = await result.response?.text();

    if (responseText) {
      const parsedData = JSON.parse(responseText);
      setBody(parsedData?.email?.body || "");
    }
  } catch (error) {
    console.error("❌ Error refining email:", error);
    alert("Failed to refine email content.");
  } finally {
    setIsLoading(false);
  }
};

export const GenerateLayout = async ({
  user,
  recipientType,
  tone,
  purpose,
  setSubject,
  setBody,
  setIsLoading,
}) => {
  if (!user || !recipientType || !tone || !purpose) {
    alert("⚠️ Missing required input for email generation.");
    return;
  }

  setIsLoading(true);
  console.log("📝 Generating email with:", {
    user,
    recipientType,
    tone,
    purpose,
  });

  const BASIC_PROMPT = `The ${user}, whose name is ${user?.firstName}, will specify the recipient type, desired tone, and purpose of the email. Generate a JSON response containing only the subject and body of the email. Ensure the email is appropriate for the recipient, maintaining the specified tone throughout. If formal, use professional language and structure; if friendly, keep it conversational and engaging.`;

  const USER_INPUT_PROMPT = `Recipient Type: ${recipientType}.
    Desired Tone: ${tone}.
    Purpose: ${purpose}.`;

  const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;

  try {
    const result = await GenerateLayout_AI.sendMessage(FINAL_PROMPT);
    console.log("🔍 Raw API Response:", result);

    const responseText = await result.response?.text();
    console.log("📝 Extracted Response Text:", responseText);

    if (!responseText) throw new Error("No response text received");

    const parsedData = JSON.parse(responseText);
    console.log("✅ Parsed Data:", parsedData);

    if (!parsedData?.email?.subject || !parsedData?.email?.body) {
      throw new Error("Invalid response format");
    }

    setSubject(parsedData.email.subject);
    setBody(parsedData.email.body);
  } catch (error) {
    console.error("❌ Error generating email:", error);
    alert("Failed to generate email content.");
  } finally {
    setIsLoading(false);
  }
};

export const formatEmailBody = (rawHtml) => {
  if (!rawHtml) return "<p>No Content</p>";
  try {
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "a",
        "b",
        "i",
        "u",
        "em",
        "strong",
        "p",
        "br",
        "span",
        "img",
        "ul",
        "ol",
        "li",
        "blockquote",
        "code",
        "pre",
        "table",
        "tr",
        "td",
        "th",
        "thead",
        "tbody",
        "tfoot",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "style",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "style",
        "target",
        "width",
        "height",
        "class",
      ],
    });
  } catch (error) {
    console.error("Error formatting email body:", error);
    return "<p>Error displaying email content</p>";
  }
};

export const handleSendEmail = async (
  e,
  to,
  subject,
  body,
  setTo,
  setSubject,
  setBody,
  setIsLoading,
  setIsComposeOpen,
  user // ✅ add user
) => {
  e.preventDefault();

  const gmailId = user?.primaryEmailAddress?.emailAddress; // ✅ use it here
  if (!gmailId) {
    alert("User email not found.");
    return;
  }

  try {
    setIsLoading(true);
    await axios.post(
      "https://goflow-9-jof0.onrender.com/send-email",
      { to, subject, body },
      {
        headers: {
          Authorization: `Bearer ${user?.primaryEmailAddress?.emailAddress}`,
        },
      }
    );
    alert("✅ Email Sent!");
    setTo("");
    setSubject("");
    setBody("");
    setIsComposeOpen(false);
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
