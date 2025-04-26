// server/utils/pincecone.js
import { Pinecone } from "@pinecone-database/pinecone";

let pineconeInstance = null;

export function getPineconeIndex() {
  if (pineconeInstance) return pineconeInstance;

  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME;
  const environment = process.env.PINECONE_ENVIRONMENT; // e.g., "us-west1-gcp"

  if (!apiKey) {
    throw new Error("Pinecone API key not found");
  }

  if (!indexName) {
    throw new Error("Pinecone index name not found");
  }

  try {
    console.log(`Connecting to Pinecone index: ${indexName}`);

    // Initialize the client with API key and environment (if provided)
    const pinecone = new Pinecone({
      apiKey,
      ...(environment && { environment }),
    });

    // Get the index
    pineconeInstance = pinecone.index(indexName);

    console.log("Successfully connected to Pinecone");
    return pineconeInstance;
  } catch (error) {
    console.error("Failed to connect to Pinecone:", error);
    throw new Error(`Failed to connect to Pinecone: ${error.message}`);
  }
}
export async function upsertToPinecone({
  id,
  values,
  metadata,
}: {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}) {
  const index = await getPineconeIndex();
  await index.upsert([
    {
      id,
      values,
      metadata,
    },
  ]);
}
