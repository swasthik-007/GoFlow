import axios from "axios";

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await axios.post("http://localhost:11434/api/embeddings", {
    model: "nomic-embed-text", // or gemma:2b if it supports embeddings
    prompt: text,
  });

  if (!response.data || !response.data.embedding) {
    throw new Error("Embedding failed");
  }

  return response.data.embedding;
}
