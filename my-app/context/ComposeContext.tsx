"use client";
import { createContext, useContext, useState } from "react";

// Define the Email type which is referenced but not defined in your code
type Email = {
  id?: string;
  subject?: string;
  body?: string;
  sender?: string;
  recipient?: string;
  date?: string;
  // Add other email properties as needed
};

type ComposeContextType = {
  isComposeOpen: boolean;
  setIsComposeOpen: (value: boolean) => void;
  composeWithAi: boolean;
  setComposeWithAi: (value: boolean) => void;
  isQuickComposeOpen: boolean;
  setIsQuickComposeOpen: (value: boolean) => void;
  recipientType: string;
  setRecipientType: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  purpose: string;
  setPurpose: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  token: string | null;
  setToken: (value: string | null) => void;
  emails: Email[];
  setEmails: (value: Email[]) => void;
  expandedEmail: Email | null;
  setExpandedEmail: (value: Email | null) => void;
  showFullContentModal: boolean;
  setShowFullContentModal: (value: boolean) => void;
  selectedEmail: Email | null;
  setSelectedEmail: (value: Email | null) => void;
  previewHTML: string | null;
  setPreviewHTML: (value: string | null) => void;
  viewHTMLCode: string | null;
  setViewHTMLCode: (value: string | null) => void;
};

// Create Context
export const ComposeContext = createContext<ComposeContextType | undefined>(
  undefined
);

// Provider Component
export function ComposeProvider({ children }: { children: React.ReactNode }) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeWithAi, setComposeWithAi] = useState(false);
  const [isQuickComposeOpen, setIsQuickComposeOpen] = useState(false);
  const [recipientType, setRecipientType] = useState("");
  const [tone, setTone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [expandedEmail, setExpandedEmail] = useState<Email | null>(null);
  const [showFullContentModal, setShowFullContentModal] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [viewHTMLCode, setViewHTMLCode] = useState<string | null>(null);
  const [recipient, setRecipient] = useState("");

  return (
    <ComposeContext.Provider
      value={{
        isComposeOpen,
        setIsComposeOpen,
        composeWithAi,
        setComposeWithAi,
        isQuickComposeOpen,
        setIsQuickComposeOpen,
        recipientType,
        setRecipientType,
        tone,
        setTone,
        purpose,
        setPurpose,
        to,
        setTo,
        subject,
        setSubject,
        body,
        setBody,
        recipient,
        setRecipient,
        isLoading,
        setIsLoading,
        token,
        setToken,
        emails,
        setEmails,
        expandedEmail,
        setExpandedEmail,
        showFullContentModal,
        setShowFullContentModal,
        selectedEmail,
        setSelectedEmail,
        previewHTML,
        setPreviewHTML,
        viewHTMLCode,
        setViewHTMLCode,
      }}
    >
      {children}
    </ComposeContext.Provider>
  );
}

// Hook to Use Context
export function useCompose() {
  const context = useContext(ComposeContext);
  if (!context) {
    throw new Error("useCompose must be used within a ComposeProvider");
  }
  return context;
}
