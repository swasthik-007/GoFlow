// app/actions/fetchEmails.ts
"use server";

import { getEmbedding } from "@/server/utils/embed";
import { getPineconeIndex } from "@/server/utils/pincecone";

// import { getPineconeIndex } from "@/lib/pinecone";
// import { getEmbedding } from "@/lib/embedding"; // assuming this exists

export async function fetchEmailsFromPinecone(category: string) {
  try {
    const embedding = await getEmbedding(category);
    const index = await getPineconeIndex();

    const results = await index.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
      filter: {
        label: category,
      },
    });

    // Ensure only plain JSON is returned
    return results.matches.map((match) => match.metadata);
  } catch (error) {
    console.error("❌ Server Error fetching from Pinecone:", error);
    return [];
  }
}
