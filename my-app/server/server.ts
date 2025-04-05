import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { simpleParser } from "mailparser";

// import { OAuth2Client } from "google-auth-library";
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

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

      // "https://www.googleapis.com/auth/gmail.full_access",
    ],
  });
  res.json({ url });
});

const TOKEN_PATH = "tokens.json";

function loadTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  }
  return null;
}

let oauthTokens = loadTokens();

function saveTokens(tokens: any) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
}

app.get("/oauth-callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    console.log("Received tokens:", tokens); // Debugging log
    oauth2Client.setCredentials(tokens);
    oauthTokens = tokens;
    saveTokens(tokens);

    res.redirect(
      `http://localhost:3000/mail?token=${tokens.access_token || ""}`
    );
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    res.status(500).send("OAuth authentication failed");
  }
});

async function ensureValidToken() {
  if (!oauthTokens) {
    throw new Error("Unauthorized - No tokens found");
  }

  const currentTime = Date.now();
  if (!oauthTokens.expiry_date || oauthTokens.expiry_date < currentTime) {
    await refreshAccessToken();
  }

  oauth2Client.setCredentials(oauthTokens);
}
async function refreshAccessToken() {
  try {
    if (!oauthTokens?.refresh_token) {
      throw new Error("No refresh token available. Please re-authenticate.");
    }
    console.log("🔄 Refreshing access token...");

    oauth2Client.setCredentials(oauthTokens);
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauthTokens = credentials;
    saveTokens(credentials);
    oauth2Client.setCredentials(credentials);
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}
app.get("/emails", async (req, res) => {
  try {
    await ensureValidToken();
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const label = req.query.label as string; // Extract label from query params
    const query = label ? `label:${label}` : "in:anywhere"; // Apply label filter

    // Fetch labels
    const labelsResponse = await gmail.users.labels.list({ userId: "me" });
    const labelsMap = new Map(
      labelsResponse.data.labels?.map((l) => [l.id, l.name]) || []
    );

    // Fetch email list
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20,
      q: query,
    });

    if (!response.data.messages) {
      return res.json([]);
    }

    // Fetch each email's details
    const emails = await Promise.all(
      response.data.messages.map(async (msg) => {
        try {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: msg.id,
            // format: "metadata",
            format: "raw",
            metadataHeaders: ["From", "Subject"],
          });
          if (!email.data.raw) return null;

          const parsedEmail = await simpleParser(
            Buffer.from(email.data.raw, "base64")
          );
          const headers = email.data.payload?.headers || [];
          const emailLabels =
            email.data.labelIds
              ?.map((id) => {
                const labelName = labelsMap.get(id);
                return labelName ? labelName.split(" ").pop() : null;
              })
              .filter(Boolean)
              .join(", ") || "Unknown";

          return {
            id: email.data.id,
            from: parsedEmail.from?.text || "Unknown",
            to: parsedEmail.to?.text || "Unknown",
            subject: parsedEmail.subject || "No Subject",
            labels: emailLabels, // ✅ Show labels
            body: parsedEmail.html || parsedEmail.textAsHtml || "No Content",
          };
        } catch (emailError) {
          console.error("Error fetching email:", emailError);
          return null;
        }
      })
    );

    res.json(emails.filter((email) => email !== null));
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

app.get("/emails/:id", async (req, res) => {
  try {
    console.log("Fetching email details...");

    await ensureValidToken();
    console.log("Token is valid, proceeding to fetch email details...");

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Email ID is required" });
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const email = await gmail.users.messages.get({
      userId: "me",
      id,
      format: "raw",
    });

    if (!email.data) {
      return res.status(404).json({ error: "Email not found" });
    }

    if (!email.data.raw) {
      return res.status(500).json({ error: "Email raw content not available" });
    }

    // Parse the raw email
    const parsedEmail = await simpleParser(
      Buffer.from(email.data.raw, "base64")
    );
    res.json({
      id: email.data.id,
      threadId: email.data.threadId,
      from: parsedEmail.from?.text || "Unknown",
      to: parsedEmail.to?.text || "Unknown",
      cc: parsedEmail.cc?.text || "",
      bcc: parsedEmail.bcc?.text || "",
      subject: parsedEmail.subject || "No Subject",
      date: parsedEmail.date || new Date(),
      text: parsedEmail.text || "",
      html: parsedEmail.html || parsedEmail.textAsHtml || "",
      attachments: parsedEmail.attachments || [],
    });
  } catch (error) {
    console.error("Error fetching email:", error);
    res.status(500).json({
      error: "Failed to fetch email",
      details: error.message,
    });
  }
});

app.delete("/emails/:id", async (req, res) => {
  try {
    console.log("🔴 Deleting email...");

    await ensureValidToken();
    console.log("✅ Token is valid, proceeding with deletion...");

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "❌ Email ID is required" });
    }

    console.log(`🗑️ Attempting to delete email with ID: ${id}`);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Delete the email
    const response = await gmail.users.messages.delete({
      userId: "me",
      id,
    });

    console.log(`✅ Email with ID ${id} deleted successfully!`);

    res.json({ message: "✅ Email deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting email:", error);

    // More specific error responses
    if (error.message.includes("Unauthorized")) {
      return res.status(401).json({
        error: "Authentication required. Please login again.",
      });
    }
    if (error.code === 404) {
      return res.status(404).json({ error: "Email not found" });
    }

    res.status(500).json({
      error: "❌ Failed to delete email",
      details: error.message,
    });
  }
});
app.post("/send-email", async (req, res) => {
  try {
    await ensureValidToken();
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

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
