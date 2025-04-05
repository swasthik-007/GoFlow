// "use client";
// import { useEmailTemplate } from "@/app/provider";
// import Canvas from "@/components/custom/Canvas";
// import EditorHeader from "@/components/custom/EditorHeader";
// import ElementsSideBar from "@/components/custom/ElementsSideBar";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios"; // Ensure axios is imported
// import DOMPurify from "dompurify"; // Import DOMPurify for sanitization
// // import { google } from "googleapis";
// // import axios from "axios";
// import dotenv from "dotenv";
// import Settings from "@/components/custom/Settings";
// import Sidebar from "@/components/sidebars";
// import Header from "@/app/components/Header";
// import { useCompose } from "@/app/context/ComposeContext";

// dotenv.config();
// function Editor() {
//   // const [viewHTMLCode, setViewHTMLCode] = useState<string | null>(null);
//   // const [recipient, setRecipient] = useState(""); // State for recipient email
//   // const [subject, setSubject] = useState(""); // State for email subject
//   // const [loading, setLoading] = useState(false);
//   // const [previewHTML, setPreviewHTML] = useState<string | null>(null); // State for email preview
//   const router = useRouter();
//   const { emailTemplate, setEmailTemplate } = useEmailTemplate();
//   const canvasRef = useRef<any>(null); // Ref for the Canvas component
//   const {
//     viewHTMLCode,
//     recipient,
//     setRecipient,
//     loading,
//     setLoading,
//     setViewHTMLCode,
//     subject,
//     setSubject,
//     previewHTML,
//     setPreviewHTML,
//   } = useCompose();

//   // Function to handle the HTML code retrieval
//   const handleViewHTMLCode = () => {
//     if (canvasRef.current) {
//       canvasRef.current.getHTMLContent(); // Call the method in Canvas to get HTML content
//     }
//   };

//   // Function to send a test email
//   const handleSendEmail = async () => {
//     console.log("Send test email button clicked");

//     if (!recipient || !subject || !viewHTMLCode) {
//       console.log("Missing fields", {
//         recipient,
//         subject,
//         htmlContentLength: viewHTMLCode?.length,
//       });
//       // toast.error("Please fill in all fields before sending the test email.");
//       alert("Please fill in all fields before sending the test email.");
//       return;
//     }

//     try {
//       console.log("Preparing email data");
//       // Prepare the email data with the correct parameter names for the backend
//       const emailData = {
//         recipient: recipient,
//         subject: subject,
//         viewHTMLCode: viewHTMLCode,
//       };

//       console.log("Email data prepared:", emailData);

//       // Send the email via your API endpoint
//       console.log("Sending fetch request to backend...");
//       const response = await fetch("http://localhost:5000/send-email-html", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(emailData),
//       });

//       console.log("Response received:", response.status, response.statusText);

//       const responseData = await response.json();
//       console.log("Response data:", responseData);

//       if (response.ok) {
//         console.log("Email sent successfully");
//         // toast.success("Test email sent successfully!");
//         alert("Test email sent successfully!");
//       } else {
//         console.error("Error in response:", responseData);
//         throw new Error(
//           responseData.error ||
//             responseData.message ||
//             "Failed to send test email."
//         );
//       }
//     } catch (error) {
//       console.error("Error sending test email:", error);
//       // toast.error(`Failed to send test email: ${error.message}`);
//       alert(`Failed to send test email: ${error.message || "Unknown error"}`);
//     }
//   };
//   useEffect(() => {
//     // Get the content passed from the query parameter
//     const queryParams = new URLSearchParams(window.location.search);
//     const generatedContent = queryParams.get("content");

//     if (generatedContent) {
//       setEmailTemplate(JSON.parse(generatedContent)); // Parse and set the email template
//     }
//   }, [setEmailTemplate]);

//   useEffect(() => {
//     if (viewHTMLCode) {
//       // Sanitize the HTML content for the preview
//       const sanitizedPreview = DOMPurify.sanitize(viewHTMLCode);
//       setPreviewHTML(sanitizedPreview); // Update the preview state
//     }
//   }, [viewHTMLCode]);

//   return (
//     <div className="h-screen flex w-full ">
//       <div className="w-[13.4%] ">
//         <Sidebar />
//       </div>
//       <div className="h-full w-[88%]  flex flex-col ">
//         <div className="h-[13%]">
//           <Header />
//         </div>

//         <div className="overflow-y-auto">
//           {/* Pass the handleViewHTMLCode function to EditorHeader */}
//           <EditorHeader viewHTMLCode={handleViewHTMLCode} />

//           {/* Input fields for recipient and subject */}
//           <div className="mt-4">
//             <input
//               type="email"
//               placeholder="Recipient Email"
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value)}
//               className="border p-2 rounded w-full mb-2"
//             />
//             <input
//               type="text"
//               placeholder="Subject"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="border p-2 rounded w-full mb-2"
//             />
//           </div>

//           {!loading ? (
//             <div className="grid grid-cols-5">
//               <ElementsSideBar />
//               <div className="col-span-3 bg-gray-100">
//                 {/* Pass the setViewHTMLCode function to Canvas */}
//                 <Canvas ref={canvasRef} viewHTMLCode={setViewHTMLCode} />
//               </div>
//               <Settings />
//             </div>
//           ) : (
//             <div>
//               <h2>Please wait...</h2>
//             </div>
//           )}

//           {/* Send Email Button */}
//           <button
//             onClick={() => handleSendEmail()}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             disabled={loading} // Disable the button while loading
//           >
//             {loading ? "Sending..." : "Send Email"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Editor;

"use client";
import { useEmailTemplate } from "@/app/provider";
import Canvas from "@/components/custom/Canvas";
import EditorHeader from "@/components/custom/EditorHeader";
import ElementsSideBar from "@/components/custom/ElementsSideBar";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import dotenv from "dotenv";
import Settings from "@/components/custom/Settings";
import Sidebar from "@/components/sidebars";
import Header from "@/app/components/Header";
import { useCompose } from "@/app/context/ComposeContext";

dotenv.config();

function Editor() {
  const router = useRouter();
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const canvasRef = useRef<any>(null); // Ref for the Canvas component
  const {
    viewHTMLCode,
    setViewHTMLCode,
    recipient,
    setRecipient,
    subject,
    setSubject,
    previewHTML,
    setPreviewHTML,
    isLoading: loading,
    setIsLoading: setLoading,
  } = useCompose();

  // Function to handle the HTML code retrieval
  const handleViewHTMLCode = () => {
    if (canvasRef.current) {
      canvasRef.current.getHTMLContent(); // Call the method in Canvas to get HTML content
    }
  };

  useEffect(() => {
    // Get the content passed from the query parameter
    const queryParams = new URLSearchParams(window.location.search);
    const generatedContent = queryParams.get("content");

    if (generatedContent) {
      try {
        setEmailTemplate(JSON.parse(generatedContent)); // Parse and set the email template
      } catch (error) {
        console.error("Failed to parse content from URL parameter:", error);
      }
    }
  }, [setEmailTemplate]);

  useEffect(() => {
    if (viewHTMLCode) {
      // Sanitize the HTML content for the preview
      const sanitizedPreview = DOMPurify.sanitize(viewHTMLCode);
      setPreviewHTML(sanitizedPreview); // Update the preview state
    }
  }, [viewHTMLCode, setPreviewHTML]);

  return (
    <div className="h-screen flex w-full ">
      <div className="w-[13.4%] ">
        <Sidebar />
      </div>
      <div className="h-full w-[88%]  flex flex-col ">
        <div className="h-[13%]">
          <Header />
        </div>

        <div className="overflow-y-auto">
          {/* Pass the handleViewHTMLCode function to EditorHeader */}
          <EditorHeader viewHTMLCode={handleViewHTMLCode} />

          {/* Input fields for recipient and subject */}
          <div className="mt-4 px-[20%]">
            <input
              type="email"
              placeholder="Recipient Email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
          </div>

          {!loading ? (
            <div className="grid grid-cols-5">
              <ElementsSideBar />
              <div className="col-span-3 bg-gray-100">
                {/* Pass the setViewHTMLCode function to Canvas */}
                <Canvas ref={canvasRef} viewHTMLCode={setViewHTMLCode} />
              </div>
              <Settings />
            </div>
          ) : (
            <div>
              <h2>Please wait...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;