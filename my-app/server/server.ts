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
app.get("/auth-url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scopes: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com",
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
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
