import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";
import * as fs from "fs";
import * as path from "path";

// Setup logging
const logToFile = (level: string, message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${level.toUpperCase()} - ${message}\n`;
  fs.appendFileSync(path.join(__dirname, "email_monitor.log"), logMessage);
  console.log(`${level.toUpperCase()}: ${message}`);
};

// --- CONFIG ---
const OLLAMA_MODEL = "nomic-embed-text";
const PINECONE_API_KEY =
  "pcsk_4SqC4L_TTtwUoAJnpL8p6fwoiLY1RgdBSmN7BUs8r2i7696QyrwSXiHxfYEfH2o8mSYyQZ";
const PINECONE_INDEX = "guflow";
const EMAIL_API_URL = "http://localhost:5000/emails";
const CHECK_INTERVAL = 600; // milliseconds (60 seconds)

// --- Connect to Pinecone ---
const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

// --- Embedding function ---
async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post("http://localhost:11434/api/embeddings", {
      model: OLLAMA_MODEL,
      prompt: text,
    });

    if (!response.data || !response.data.embedding) {
      throw new Error("Embedding failed");
    }

    return response.data.embedding;
  } catch (error) {
    logToFile("error", `Error getting embedding: ${error}`);
    throw error;
  }
}

// --- Track processed emails ---
const processedEmails = new Set<string>();

interface Email {
  id: string;
  from: string;
  to: string;
  subject?: string;
  body?: string
}

async function fetchAndProcessNewEmails(): Promise<number> {
  try {
    const index = pc.index(PINECONE_INDEX);
    const response = await axios.get(EMAIL_API_URL);
    const emails: Email[] = response.data;

    let newEmails = 0;

    for (const email of emails) {
      const emailId = email.id;

      // Skip if already processed
      if (processedEmails.has(emailId)) {
        continue;
      }

      const subject = email.subject || "";
      const body = email.body || "";
      const text = `${subject}`.trim();

      try {
        const vector = await getEmbedding(text);

        await index.upsert([
          {
            id: emailId,
            values: vector,
            metadata: {
              from: email.from,
              to: email.to,
              subject: subject,
              processed_at: new Date().toISOString(),
              body: email.body,
            },
          },
        ]);

        processedEmails.add(emailId);
        newEmails++;
        logToFile("info", `Processed email ${emailId}`);
      } catch (error) {
        logToFile("error", `Failed to process email ${emailId}: ${error}`);
      }
    }

    if (newEmails > 0) {
      logToFile("info", `Processed ${newEmails} new emails`);
    }

    return newEmails;
  } catch (error) {
    logToFile("error", `Error fetching emails: ${error}`);
    return 0;
  }
}

async function main() {
  logToFile("info", "Starting email monitoring service");
  try {
    while (true) {
      await fetchAndProcessNewEmails();
      await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
    }
  } catch (error) {
    logToFile("critical", `Service crashed: ${error}`);
  }
}

// For running as a standalone script
if (require.main === module) {
  main().catch((error) => {
    logToFile("critical", `Service failed to start: ${error}`);
  });
}

// Export for importing as a module
export { fetchAndProcessNewEmails };
