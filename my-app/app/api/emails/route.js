// app/api/emails/route.js
import { NextResponse } from "next/server";
import { getPineconeIndex } from "@/server/utils/pincecone";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const recipient = searchParams.get("recipient");

  if (!recipient) {
    return NextResponse.json({ emails: [] });
  }

  try {
    console.log("API route: Fetching emails for recipient:", recipient);

    // Get the Pinecone index
    let index;
    try {
      index = getPineconeIndex();
      console.log("API route: Successfully got Pinecone index");
    } catch (indexError) {
      console.error("API route: Error getting Pinecone index:", indexError);
      return NextResponse.json(
        { emails: [], error: "Failed to initialize Pinecone index" },
        { status: 500 }
      );
    }

    // Create a dummy vector for querying
    const dummyVector = Array(768).fill(0.1);

    // Query Pinecone
    let res;
    try {
      res = await index.query({
        vector: dummyVector,
        topK: 100,
        includeMetadata: true,
      });
      console.log("API route: Successfully queried Pinecone");
    } catch (queryError) {
      console.error("API route: Error querying Pinecone:", queryError);
      return NextResponse.json(
        { emails: [], error: "Failed to query Pinecone database" },
        { status: 500 }
      );
    }

    // Filter the emails based on the recipient
    const recipientLower = recipient.trim().toLowerCase();
    const filteredEmails = res.matches.filter((email) => {
      const emailFrom = (email.metadata.from || "").toLowerCase();
      const emailTo = (email.metadata.to || "").toLowerCase();
      const emailBody = (email.metadata.body || "").toLowerCase();
      return (
        emailFrom.includes(recipientLower) ||
        emailTo.includes(recipientLower) ||
        emailBody.includes(recipientLower)
      );
    });

    console.log(
      `API route: Found ${filteredEmails.length} emails for recipient: ${recipient}`
    );
    return NextResponse.json({ emails: filteredEmails });
  } catch (error) {
    console.error("API route: Unexpected error:", error);
    return NextResponse.json(
      { emails: [], error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
