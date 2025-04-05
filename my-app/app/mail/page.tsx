"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import DOMPurify from "dompurify";
import { decodeHeader } from "@/app/utils/decodeHeader";
// import "../../globals.css";
import "@/app/globals.css";
import ChatBot from "@/app/components/chatbot";
import Sidebar from "@/components/sidebars";
import Header from "@/app/components/Header";
import { SignInButton, useUser } from "@clerk/nextjs";
// import { useCompose } from "@/app/context/ComposeContext";
import { handledelete } from "@/app/helper/index";
import { useCompose } from "@/context/ComposeContext";

// Add this helper function to strip HTML tags and get plain text
const stripHtmlTags = (html) => {
  if (!html) return "";
  // Create a DOM element to parse the HTML safely
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = DOMPurify.sanitize(html);
  // Return the text content only
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default function CategoryPage() {
  const { category } = useParams(); // Get category from URL
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showFullContentModal, setShowFullContentModal] = useState(false);
  const { isSignedIn, user } = useUser();
  const {
    isComposeOpen,
    setIsComposeOpen,
    composeWithAi,
    isQuickComposeOpen,
    setIsQuickComposeOpen,
    setComposeWithAi,
    setIsLoading,
    isLoading,
    setEmails,
    setToken,
    token,
    emails,
    setTo,
    setSubject,
    setBody,
    setRecipientType,
    setTone,
    setPurpose,
    setExpandedEmail,
    expandedEmail,
  } = useCompose();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");

    if (tokenFromURL) {
      sessionStorage.setItem("oauth_token", tokenFromURL);
      setToken(tokenFromURL);
    } else {
      const savedToken = sessionStorage.getItem("oauth_token");
      if (savedToken) setToken(savedToken);
    }
  }, []);

  const fetchEmails = useCallback(async () => {
    if (!token || !category) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/emails?label=${category}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmails(response.data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, category]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const formatEmailBody = (rawHtml) => {
    if (!rawHtml) return "<p>No Content</p>";
    try {
      return DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          "a",
          "b",
          "i",
          "u",
          "em",
          "strong",
          "p",
          "br",
          "span",
          "img",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "table",
          "tr",
          "td",
          "th",
          "thead",
          "tbody",
          "tfoot",
          "div",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "style",
        ],
        ALLOWED_ATTR: [
          "href",
          "src",
          "alt",
          "style",
          "target",
          "width",
          "height",
          "class",
        ],
      });
    } catch (error) {
      console.error("Error formatting email body:", error);
      return "<p>Error displaying email content</p>";
    }
  };

  // New function to get plain text preview
  const getTextPreview = (email) => {
    // Use snippet if available, otherwise strip HTML from body
    if (email.snippet) {
      return decodeHeader(email.snippet);
    } else if (email.body) {
      return stripHtmlTags(email.body).substring(0, 100);
    }
    return "No content available";
  };

  const openFullContentModal = (email) => {
    setSelectedEmail(emails[email]);
    setShowFullContentModal(true);
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeFullContentModal = () => {
    setShowFullContentModal(false);
    setSelectedEmail(null);
    // Re-enable scrolling on the body when modal is closed
    document.body.style.overflow = "auto";
  };

  const handleEmailClick = (idx) => {
    // Simply open the modal when clicking an email
    openFullContentModal(idx);
  };

  // Function to handle modal animation
  const getModalClasses = () => {
    return showFullContentModal
      ? "fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out opacity-100"
      : "fixed inset-0 bg-black bg-opacity-0 backdrop-blur-none flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out opacity-0 pointer-events-none";
  };

  // Function to handle modal content animation
  const getModalContentClasses = () => {
    return showFullContentModal
      ? "bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-2/3 max-h-[90vh] flex flex-col transform transition-transform duration-300 ease-out scale-100"
      : "bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-2/3 max-h-[90vh] flex flex-col transform transition-transform duration-300 ease-out scale-95";
  };

  return (
    <>
      <div className="h-screen flex w-full overflow-hidden">
        <div className="w-[13.4%] ">
          <Sidebar />
        </div>
        <div className="h-full w-[88%]  flex flex-col ">
          <div className="h-[10%]">
            <Header />
          </div>

          <div className="h-[90%] flex  w-[95%]  m-auto ">
            <div className="overflow-y-auto h-screen max-h-[calc(100vh-10%)] w-2/3 p-6 bg-gray-900 rounded-lg shadow-md transition-all duration-300">
              {!isSignedIn ? (
                <div className="flex justify-center mt-6">
                  <SignInButton />
                </div>
              ) : (
                <>
                  {token && (
                    <button
                      onClick={fetchEmails}
                      disabled={isLoading}
                      className={`bg-gradient-to-br from-green-400 to-blue-600 text-white px-4 py-2 rounded w-full mb-4 transition ${
                        isComposeOpen || isQuickComposeOpen ? "opacity-30" : ""
                      } disabled:opacity-50`}
                    >
                      {isLoading ? "Fetching..." : "📩 Refresh Emails"}
                    </button>
                  )}
                  <div className="space-y-4">
                    {emails.length === 0 ? (
                      token ? (
                        <p className="text-center text-gray-500">loading...</p>
                      ) : (
                        <p className="text-center text-gray-500">
                          Connect your Gmail account to view emails.
                        </p>
                      )
                    ) : (
                      emails.map((email, idx) => {
                        const senderName = decodeHeader(email.from)
                          .split(" <")[0]
                          .replace(/"/g, "");

                        return (
                          <div
                            key={idx}
                            className="overflow-y-auto group border p-4 rounded shadow bg-black hover:shadow-lg transition cursor-pointer flex justify-between items-center gap-x-4"
                            onClick={() => handleEmailClick(idx)}
                          >
                            {/* Left Section: Sender & Date */}
                            <div className="flex-1">
                              <p className="font-medium text-white">
                                📧 {senderName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {email.date}
                              </p>

                              {/* Now using the getTextPreview function for plain text */}
                              <p className="text-gray-600 mt-2">
                                {getTextPreview(email)}...
                              </p>
                            </div>

                            {/* Right Section: Delete Button (Hidden until hover) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handledelete(
                                  email?.id,
                                  setEmails,
                                  setIsLoading,
                                  token
                                );
                              }}
                              className="opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 ml-4"
                            >
                              🗑️
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="w-1/3 m-8  border-black border-2 rounded-lg ">
              <ChatBot />
            </div>
          </div>

          {/* Modified Modal: click-outside-to-close, single close button, and updated header */}
          <div
            className={getModalClasses()}
            onClick={closeFullContentModal} // Click anywhere outside to close
          >
            {selectedEmail && (
              <div
                className={getModalContentClasses()}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
              >
                {/* Header section with only recipient and logged in user */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedEmail.subject
                        ? decodeHeader(selectedEmail.subject)
                        : "No Subject"}
                    </h2>

                    {/* Close button at top right */}
                    <button
                      onClick={closeFullContentModal}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                      aria-label="Close"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Email header with recipient and logged in user only */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex">
                      <span className="w-20 font-medium text-gray-600 dark:text-gray-400">
                        Recipient:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 flex-1">
                        {selectedEmail.to
                          ? decodeHeader(selectedEmail.to)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-20 font-medium text-gray-600 dark:text-gray-400">
                        User:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 flex-1">
                        {user?.fullName || user?.username || "Current User"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email body with improved styling */}
                <div className="p-6 overflow-y-auto flex-grow bg-gray-200 dark:bg-gray-900">
                  <div
                    className="email-content text-gray-800 dark:text-gray-200 prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: formatEmailBody(selectedEmail.body || ""),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add global styles for email content styling */}
      <style jsx global>{`
        .email-content a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .email-content img {
          max-width: 100%;
          height: auto;
        }

        .email-content blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 1rem;
          color: #4b5563;
          margin: 1rem 0;
        }

        .email-content pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
        }

        .dark .email-content blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }

        .dark .email-content pre {
          background-color: #1f2937;
        }
      `}</style>
    </>
  );
}