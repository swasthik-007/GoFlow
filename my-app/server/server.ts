// // import { getLastEmailId, setLastEmailId } from "./utils/emailTracker";
// import express from "express";
// import cors from "cors";
// import { google } from "googleapis";
// import dotenv from "dotenv";
// import fs from "fs";
// import { simpleParser } from "mailparser";
// import { log } from "console";
// import cron from "node-cron";
// import { fetchEmailsAndStoreInPinecone } from "./utils/syncEmails";
// import { upsertToPinecone } from "./utils/pincecone";
// import { getEmbedding } from "./utils/embed";
// import { createClient } from "@supabase/supabase-js";

// export const supabase = createClient(
//   process.env.PROJECT_URL!,
//   process.env.ANON_KEY!
// );
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors());
// export async function saveTokensToSupabase(userId: string, tokens: any) {
//   const { error } = await supabase
//     .from("gmail_tokens")
//     .upsert({
//       user_id: userId,
//       ...tokens,
//       expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000
//     });

//   if (error) console.error("❌ Token save error:", error);
// }

// export async function loadTokensFromSupabase(userId: string) {
//   const { data, error } = await supabase
//     .from("gmail_tokens")
//     .select("*")
//     .eq("user_id", userId)
//     .single();

//   if (error) {
//     console.error("❌ Token load error:", error);
//     return null;
//   }

//   return data;
// }
// function startGmailSyncJob() {
//   const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//   setInterval(async () => {
//     try {
//       const res = await gmail.users.messages.list({
//         userId: "me",
//         q: "is:unread", // You can customize query
//         maxResults: 5,
//       });

//       const messages = res.data.messages || [];

//       for (const message of messages) {
//         const msg = await gmail.users.messages.get({
//           userId: "me",
//           id: message.id!,
//         });

//         const snippet = msg.data.snippet || "";
//         const subjectHeader = msg.data.payload?.headers?.find(
//           (h) => h.name === "Subject"
//         );
//         const subject = subjectHeader?.value || "(No Subject)";

//         // 🔍 Embed and send to Pinecone
//         const vector = await getEmbedding(snippet);
//         await upsertToPinecone({
//           id: `gmail-${message.id}`,
//           values: vector,
//           metadata: {
//             subject,
//             snippet,
//             date: msg.data.internalDate,
//           },
//         });

//         // ✅ Optionally mark as read
//         await gmail.users.messages.modify({
//           userId: "me",
//           id: message.id!,
//           requestBody: {
//             removeLabelIds: ["UNREAD"],
//           },
//         });

//         console.log("📩 Synced email:", subject);
//       }
//     } catch (err) {
//       console.error("❌ Error fetching emails:", err);
//     }
//   }, 10000); // every 10s
// }

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
// const REDIRECT_URI = process.env.REDIRECT_URI!;

// export const oauth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   "https://goflow-8.onrender.com/oauth-callback"
// );

// app.post("/send-email-html", async (req, res) => {

//   try {
//     await ensureValidToken();

//     const { recipient, subject, viewHTMLCode } = req.body;

//     if (!recipient || !subject || !viewHTMLCode) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Get dynamic access token
//     // console.log("Getting access token...");
//     const { token } = await oauth2Client.getAccessToken();
//     if (!token) {
//       throw new Error("Failed to retrieve access token");
//     }

//     const email = [
//       `To: ${recipient}`,
//       `Subject: ${subject}`,
//       `Content-Type: text/html; charset=UTF-8`,
//       "",
//       viewHTMLCode,
//     ].join("\n");
//     const encodedMessage = Buffer.from(email)
//       .toString("base64")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//     const response = await gmail.users.messages.send({
//       userId: "me",
//       requestBody: { raw: encodedMessage },
//     });

//     return res.json({ message: "✅ Email Sent!", data: response.data });
//   } catch (error) {

//     if (error.response) {
//       console.error("API Response Error:", error.response.data);
//     }

//     return res.status(500).json({
//       error: "Failed to send email",
//       message: error.message,
//     });
//   }
// });
// const TOKEN_PATH = "tokens.json";
// function saveTokens(tokens: any) {
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
// }
// function loadTokens() {
//   if (fs.existsSync(TOKEN_PATH)) {
//     return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
//   }
//   return null;
// }
// let oauthTokens = loadTokens();

// app.get("/auth-url", (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: [
//       "https://www.googleapis.com/auth/gmail.readonly",
//       "https://www.googleapis.com/auth/gmail.send",
//       "https://www.googleapis.com/auth/gmail.modify",
//       "https://mail.google.com/",
//       "https://www.googleapis.com/auth/userinfo.email",
//       "https://www.googleapis.com/auth/userinfo.profile",

//       // "https://www.googleapis.com/auth/gmail.full_access",
//     ],
//   });
//   res.json({ url });
// });

// app.get("/oauth-callback", async (req, res) => {
//   try {
//     const { code } = req.query;
//     if (!code) {
//       return res.status(400).json({ error: "Missing authorization code" });
//     }
//     const { tokens } = await oauth2Client.getToken(code);
//     await saveTokensToSupabase(userEmail, tokens);

//     console.log("✅ OAuth Success! Tokens saved.");

//     res.redirect(`https://go-flow-mu.vercel.app/category/sent || ""}`);
//   } catch (error) {
//     console.error("OAuth Callback Error:", error);
//     res.status(500).send("OAuth authentication failed");
//   }
// });

// async function refreshAccessToken() {
//   try {
//     if (!oauthTokens?.refresh_token) {
//       throw new Error("No refresh token available. Please re-authenticate.");
//     }
//     console.log("🔄 Refreshing access token...");

//     oauth2Client.setCredentials(oauthTokens);
//     const { credentials } = await oauth2Client.refreshAccessToken();
//     oauthTokens = credentials;
//     saveTokens(credentials);
//     oauth2Client.setCredentials(credentials);
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//   }
// }

// export async function ensureValidToken() {
//   if (!oauthTokens) {
//     throw new Error("Unauthorized - No tokens found");
//   }

//   const currentTime = Date.now();
//   if (!oauthTokens.expiry_date || oauthTokens.expiry_date < currentTime) {
//     await refreshAccessToken();
//   }

//   oauth2Client.setCredentials(oauthTokens);
// }
// app.get("/emails", async (req, res) => {
//   try {
//     await ensureValidToken();
//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//     const emailLabel = req.query.label as string; // Extract label from query params
//     const query = emailLabel ? `label:${emailLabel}` : "in:anywhere"; // Apply label filter

//     // Fetch labels
//     const labelsResponse = await gmail.users.labels.list({ userId: "me" });
//     const labelsMap = new Map(
//       labelsResponse.data.labels?.map((l) => [l.id, l.name]) || []
//     );

//     // Fetch email list
//     const response = await gmail.users.messages.list({
//       userId: "me",
//       maxResults: 20,
//       q: query,
//     });

//     if (!response.data.messages) {
//       return res.json([]);
//     }

//     // Fetch each email's details
//     const emails = await Promise.all(
//       response.data.messages.map(async (msg) => {
//         try {
//           const email = await gmail.users.messages.get({
//             userId: "me",
//             id: msg.id,
//             // format: "metadata",
//             format: "raw",
//             metadataHeaders: ["From", "Subject"],
//           });
//           if (!email.data.raw) return null;

//           const parsedEmail = await simpleParser(
//             Buffer.from(email.data.raw, "base64")
//           );
//           const headers = email.data.payload?.headers || [];
//           const emailLabels =
//             email.data.labelIds
//               ?.map((id) => {
//                 const labelName = labelsMap.get(id);
//                 return labelName ? labelName.split(" ").pop() : null;
//               })
//               .filter(Boolean)
//               .join(", ") || "Unknown";

//           return {
//             id: email.data.id,
//             from: parsedEmail.from?.text || "Unknown",
//             to: parsedEmail.to?.text || "Unknown",
//             subject: parsedEmail.subject || "No Subject",
//             labels: emailLabels, // ✅ Show labels
//             body: parsedEmail.html || parsedEmail.textAsHtml || "No Content",
//           };
//         } catch (emailError) {
//           console.error("Error fetching email:", emailError);
//           return null;
//         }
//       })
//     );

//     res.json(emails.filter((email) => email !== null));
//   } catch (error) {
//     console.error("Error fetching emails:", error);
//     res.status(500).json({ error: "Failed to fetch emails" });
//   }
// });

// app.post("/send-email", async (req, res) => {
//   try {
//     await ensureValidToken();
//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });
//     const { to, subject, body } = req.body;

//     const rawEmail = [`To: ${to}`, `Subject: ${subject}`, "", body].join("\n");

//     const encodedMessage = Buffer.from(rawEmail)
//       .toString("base64")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");

//     await gmail.users.messages.send({
//       userId: "me",
//       requestBody: { raw: encodedMessage },
//     });

//     res.json({ message: "✅ Email Sent Successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ error: "Failed to send email" });
//   }
// });
// app.post("/logout", (req, res) => {
//   try {
//     oauthTokens = null;
//     if (fs.existsSync(TOKEN_PATH)) {
//       fs.unlinkSync(TOKEN_PATH);
//     }
//     res.json({ message: "✅ Logged out successfully!" });
//   } catch (error) {
//     console.error("Error during logout:", error);
//     res.status(500).json({ error: "Failed to log out" });
//   }
// });

// app.get("/emails/:id", async (req, res) => {
//   try {
//     console.log("Fetching email details...");

//     await ensureValidToken();
//     console.log("Token is valid, proceeding to fetch email details...");

//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "Email ID is required" });
//     }

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//     //
//     //
//     //  email details with raw format
//     const email = await gmail.users.messages.get({
//       userId: "me",
//       id,
//       format: "raw", // Change to "raw" to get the base64 encoded email
//     });

//     if (!email.data) {
//       return res.status(404).json({ error: "Email not found" });
//     }

//     if (!email.data.raw) {
//       return res.status(500).json({ error: "Email raw content not available" });
//     }

//     // Parse the raw email
//     const parsedEmail = await simpleParser(
//       Buffer.from(email.data.raw, "base64")
//     );
//     res.json({
//       id: email.data.id,
//       threadId: email.data.threadId,
//       from: parsedEmail.from?.text || "Unknown",
//       to: parsedEmail.to?.text || "Unknown",
//       cc: parsedEmail.cc?.text || "",
//       bcc: parsedEmail.bcc?.text || "",
//       subject: parsedEmail.subject || "No Subject",
//       date: parsedEmail.date || new Date(),
//       text: parsedEmail.text || "",
//       html: parsedEmail.html || parsedEmail.textAsHtml || "",
//       attachments: parsedEmail.attachments || [],
//     });
//   } catch (error) {
//     console.error("Error fetching email:", error);
//     res.status(500).json({
//       error: "Failed to fetch email",
//       details: error.message,
//     });
//   }
// });
// app.delete("/emails/:id", async (req, res) => {
//   try {
//     console.log("🔴 Deleting email...");

//     await ensureValidToken();
//     console.log("✅ Token is valid, proceeding with deletion...");

//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "❌ Email ID is required" });
//     }

//     console.log(`🗑️ Attempting to delete email with ID: ${id}`);

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });

//     // Delete the email
//     const response = await gmail.users.messages.delete({
//       userId: "me",
//       id,
//     });

//     console.log(`✅ Email with ID ${id} deleted successfully!`);

//     res.json({ message: "✅ Email deleted successfully!" });
//   } catch (error) {
//     console.error("❌ Error deleting email:", error);

//     // More specific error responses
//     if (error.message.includes("Unauthorized")) {
//       return res.status(401).json({
//         error: "Authentication required. Please login again.",
//       });
//     }
//     if (error.code === 404) {
//       return res.status(404).json({ error: "Email not found" });
//     }

//     res.status(500).json({
//       error: "❌ Failed to delete email",
//       details: error.message,
//     });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// server.ts
// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

// Init
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  "https://btcksyamxntsccpafbzd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0Y2tzeWFteG50c2NjcGFmYnpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjkzOTUxMCwiZXhwIjoyMDYyNTE1NTEwfQ.wG5G5De-gtGLMOClbHP1VxEdyOnIH8BBIBwmxm_a1AE"
);

// Google OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "https://goflow-8.onrender.com/oauth-callback"
);

// Save tokens in Supabase
async function saveTokensToSupabase(userId: string, tokens: any) {
  const { error } = await supabase.from("gmail_tokens").upsert({
    user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000,
  });
  if (error) console.error("❌ Token save error:", error);
  else console.log("✅ Token saved for:", userId);
}

// Load tokens from Supabase
async function loadTokensFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from("gmail_tokens")
    .select("access_token, refresh_token, scope, token_type, expiry_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    console.error("❌ Token load error:", error || "Token not found");
    return null;
  }
  return data;
}

// Ensure token is valid
async function ensureValidToken(userId: string) {
  const tokens = await loadTokensFromSupabase(userId);
  if (!tokens) throw new Error("Unauthorized: No token found");

  oauth2Client.setCredentials(tokens);
  if (!tokens.expiry_date || tokens.expiry_date < Date.now()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await saveTokensToSupabase(userId, credentials);
    oauth2Client.setCredentials(credentials);
  }
}

// Auth URL endpoint
app.get("/auth-url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
  res.json({ url });
});

// OAuth callback endpoint
app.get("/oauth-callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: "me" });
    const email = profile.data.emailAddress!;

    await saveTokensToSupabase(email, tokens);
    res.redirect("https://go-flow-mu.vercel.app/category/sent || \"\"");
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).send("Authentication failed");
  }
});

// Fetch emails
app.get("/emails", async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(" ")[1];
    if (!userId) throw new Error("Missing user token");

    await ensureValidToken(userId);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const label = req.query.label as string;

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: label ? `label:${label}` : "in:anywhere",
    });

    const messages = response.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "raw",
        });
        return email.data;
      })
    );

    res.json(emails);
  } catch (error) {
    console.error("Email fetch error:", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

// Send email
app.post("/send-email", async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(" ")[1];
    if (!userId) throw new Error("Missing user token");

    await ensureValidToken(userId);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const { to, subject, body } = req.body;

    const rawEmail = [`To: ${to}`, `Subject: ${subject}`, "", body].join("\n");
    const encodedMessage = Buffer.from(rawEmail)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.json({ message: "✅ Email Sent Successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Send HTML email
app.post("/send-email-html", async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(" ")[1];
    if (!userId) throw new Error("Missing user token");

    await ensureValidToken(userId);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const { recipient, subject, viewHTMLCode } = req.body;

    const email = [
      `To: ${recipient}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      "",
      viewHTMLCode,
    ].join("\n");

    const encodedMessage = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.json({ message: "✅ HTML Email Sent!", data: response.data });
  } catch (error) {
    console.error("Error sending HTML email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));