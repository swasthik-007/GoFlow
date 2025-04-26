import { google } from "googleapis";
import { simpleParser } from "mailparser";
// import { getEmbedding } from "./embed"; // your embedding logic using Ollama or other
// import { upsertToPinecone } from "./pinecone"; // your pinecone push logic
import { ensureValidToken, oauth2Client } from "../server"; // your token logic
import { getEmbedding } from "./embed";
import { upsertToPinecone } from "./pincecone";

// Store last email ID to avoid duplication
let lastEmailId: string | null = null;

export async function fetchEmailsAndStoreInPinecone() {
  await ensureValidToken();
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    q: "in:inbox",
  });

  if (!response.data.messages) return;

  for (const message of response.data.messages) {
    const id = message.id;
    if (!id || id === lastEmailId) continue; // skip if duplicate

    const rawEmail = await gmail.users.messages.get({
      userId: "me",
      id: id,
      format: "raw",
    });

    const parsed = await simpleParser(
      Buffer.from(rawEmail.data.raw!, "base64")
    );
    const content = parsed.text || parsed.html || "";

    // Generate embeddings
    const embedding = await getEmbedding(content);

    // Push to vector DB
    await upsertToPinecone({
      id: id,
      values: embedding,
      metadata: {
        subject: parsed.subject || "No Subject",
        from: parsed.from?.text || "",
      },
    });

    lastEmailId = id; // update last email ID
  }
}
