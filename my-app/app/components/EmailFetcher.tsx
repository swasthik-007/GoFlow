// app/components/EmailFetcher.tsx
"use client";

import { fetchEmailsByCategory } from "@/server/utils/pincecone";
// import { fetchEmailsByCategory } from "@/server/utils/pincecone";
import { useState, useEffect } from "react";
// import { fetchEmailsByCategory } from "@/server/lib/pinecone";

interface Email {
  // Define your email interface properties here
  id: string;
  subject: string;
  body: string;
  sender: string;
  // Add other fields as needed
}

export default function EmailFetcher({ category }: { category: string }) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmails() {
      if (!category) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchEmailsByCategory(category);
        setEmails(
          result.filter((email): email is Email => email !== undefined)
        );
      } catch (err) {
        setError("Failed to load emails. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadEmails();
  }, [category]);

  if (isLoading) return <div>Loading emails...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="email-list">
      <h2>Emails related to "{category}"</h2>
      {emails.length === 0 ? (
        <p>No emails found for this category.</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <h3>{email.subject}</h3>
              <p>From: {email.sender}</p>
              <p>{email.body.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
