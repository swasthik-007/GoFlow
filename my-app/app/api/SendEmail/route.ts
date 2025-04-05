import { google } from "googleapis";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN!;
const USER_EMAIL = process.env.GMAIL_USER!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function POST(req: Request) {
  try {
    const { recipient, subject, viewHTMLCode } = await req.json();
    
    if (!recipient || !subject || !viewHTMLCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get dynamic access token
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Failed to retrieve access token");
    }

    // Create email message in RFC 2822 format
    const email = [
      `To: ${recipient}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=UTF-8`,
      "",
      viewHTMLCode,
    ].join("\n");

    // Encode the message in Base64 URL-safe format
    const encodedMessage = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Set up Gmail API
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Send the email
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    return NextResponse.json({ message: "✅ Email Sent!", data: res.data }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}