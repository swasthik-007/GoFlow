// app/api/pinecone-test/route.js
import { NextResponse } from "next/server";
import { getPineconeIndex } from "@/server/utils/pincecone";

export async function GET() {
  try {
    // Try to connect to Pinecone
    const index = getPineconeIndex();

    // Get index stats to verify connection
    const stats = await index.describeIndexStats();

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Pinecone",
      indexName: guflow,
      stats,
    });
  } catch (error) {
    console.error("Pinecone connection test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Pinecone",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        config: {
          apiKey:
            "pcsk_4SqC4L_TTtwUoAJnpL8p6fwoiLY1RgdBSmN7BUs8r2i7696QyrwSXiHxfYEfH2o8mSYyQZ"
              ? "✓ Set"
              : "✗ Missing",
          indexName: "guflow" || "Missing",
          environment: "us-east-1" || "Missing",
        },
      },
      { status: 500 }
    );
  }
}
