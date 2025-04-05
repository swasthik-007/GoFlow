// "use client";
// import Image from "next/image";
// import React, { useEffect } from "react";
// import { Button } from "../ui/button";
// import { Code, Monitor, Smartphone } from "lucide-react";
// import { useEmailTemplate, useScreenSize } from "@/app/provider";

// import { useParams } from "next/navigation";
// import { useCompose } from "@/app/context/ComposeContext";
// import DOMPurify from "dompurify"; // Import DOMPurify for sanitization

// function EditorHeader({ viewHTMLCode }) {
//   const { screenSize, setScreenSize } = useScreenSize();
//   const {
//     recipient,
//     setRecipient,
//     subject,
//     setSubject,
//     previewHTML,
//     setPreviewHTML,
//     // viewHTMLCode,
//     setViewHTMLCode,
//   } = useCompose();
//   // const updateEmailTemplate = useMutation(api.emailTemplate.UpdateTemplateDesign)
//   const { templateId } = useParams();
//   // const { emailTemplate, setEmailTemplate } = useEmailTemplate();

//   // const onSaveTemplate= async()=> {
//   //   await updateEmailTemplate({
//   //     tid: templateId,
//   //     design: emailTemplate,
//   //   });
//   //   toast('Email template saved successfully')
//   // }

//   // const handleSendEmail = async () => {
//   //   console.log("Send test email button clicked");

//   //   if (!recipient || !subject || !viewHTMLCode) {
//   //     console.log("Missing fields", {
//   //       recipient,
//   //       subject,
//   //       htmlContentLength: viewHTMLCode?.length,
//   //     });
//   //     // toast.error("Please fill in all fields before sending the test email.");
//   //     alert("Please fill in all fields before sending the test email.");
//   //     return;
//   //   }

//   //   try {
//   //     console.log("Preparing email data");
//   //     // Prepare the email data with the correct parameter names for the backend
//   //     const emailData = {
//   //       recipient: recipient,
//   //       subject: subject,
//   //       viewHTMLCode: viewHTMLCode,
//   //     };

//   //     console.log("Email data prepared:", emailData);

//   //     // Send the email via your API endpoint
//   //     console.log("Sending fetch request to backend...");
//   //     const response = await fetch("http://localhost:5000/send-email-html", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(emailData),
//   //     });

//   //     console.log("Response received:", response.status, response.statusText);

//   //     const responseData = await response.json();
//   //     console.log("Response data:", responseData);

//   //     if (response.ok) {
//   //       console.log("Email sent successfully");
//   //       // toast.success("Test email sent successfully!");
//   //       alert("Test email sent successfully!");
//   //     } else {
//   //       console.error("Error in response:", responseData);
//   //       throw new Error(
//   //         responseData.error ||
//   //           responseData.message ||
//   //           "Failed to send test email."
//   //       );
//   //     }
//   //   } catch (error) {
//   //     console.error("Error sending test email:", error);
//   //     // toast.error(`Failed to send test email: ${error.message}`);
//   //     alert(`Failed to send test email: ${error.message || "Unknown error"}`);
//   //   }
//   // };
//   const [htmlCode, setHtmlCode] = React.useState("");

//   const handleSendEmail = async () => {
//     console.log("Send test email button clicked");

//     if (!recipient || !subject || !htmlCode) {
//       // Use htmlCode instead
//       console.log("Missing fields", {
//         recipient,
//         subject,
//         htmlContentLength: htmlCode?.length, // Use htmlCode
//       });
//       alert("Please fill in all fields before sending the test email.");
//       return;
//     }

//     try {
//       console.log("Preparing email data");
//       const emailData = {
//         recipient,
//         subject,
//         viewHTMLCode: htmlCode, // Use htmlCode
//       };

//       console.log("Email data prepared:", emailData);

//       const response = await fetch("http://localhost:5000/send-email-html", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(emailData),
//       });

//       console.log("Response received:", response.status, response.statusText);

//       const responseData = await response.json();
//       console.log("Response data:", responseData);

//       if (response.ok) {
//         console.log("Email sent successfully");
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
//       alert(`Failed to send test email: ${error.message || "Unknown error"}`);
//     }
//   };

//   useEffect(() => {
//     if (viewHTMLCode) {
//       // Sanitize the HTML content for the preview
//       const sanitizedPreview = DOMPurify.sanitize(viewHTMLCode);
//       setPreviewHTML(sanitizedPreview); // Update the preview state
//     }
//   }, [viewHTMLCode]);

//   return (
//     <div className="p-4 shadow-sm flex justify-between items-center">
//       {/* <Image src={"/logo.svg"} alt="logo" width={200} height={150} /> */}
//       <div className="w-1/3"></div>
//       <div className="flex gap-3 w-1/3">
//         <Button
//           variant="ghost"
//           onClick={() => setScreenSize("desktop")}
//           className={`${
//             screenSize == "desktop" && "bg-purple-100 text-primary"
//           }`}
//         >
//           <Monitor />
//           Desktop
//         </Button>
//         <Button
//           variant="ghost"
//           onClick={() => setScreenSize("mobile")}
//           className={`${
//             screenSize == "mobile" && "bg-purple-100 text-primary"
//           }`}
//         >
//           <Smartphone />
//           Mobile
//         </Button>
//       </div>
//       <div className="flex gap-3 ">
//         {/* Button to trigger HTML code retrieval */}
//         <Button
//           variant="ghost"
//           className="hover: text-primary hover:bg-purple-100"
//           onClick={() => viewHTMLCode()}
//         >
//           <Code />
//         </Button>

//         <Button onClick={handleSendEmail} variant="outline">
//           Send Test Email
//         </Button>
//         {/* <Button onClick={onSaveTemplate}>Save template</Button> */}
//       </div>
//     </div>
//   );
// }

// export default EditorHeader;

// // "use client";
// // import Image from "next/image";
// // import React from "react";
// // import { Button } from "../ui/button";
// // import { Code, Monitor, Smartphone } from "lucide-react";
// // import { useEmailTemplate, useScreenSize } from "@/app/provider";
// // import { useParams } from "next/navigation";
// // import { toast } from "sonner";

// // function EditorHeader({ viewHTMLCode, recipient, subject, htmlContent }) {
// //   const { screenSize, setScreenSize } = useScreenSize();
// //   const { templateId } = useParams();
// //   const { emailTemplate } = useEmailTemplate();

// //   // Function to send a test email
// //   const handleSendTestEmail = async () => {
// //     if (!recipient || !subject || !htmlContent) {
// //       toast.error("Please fill in all fields before sending the test email.");
// //       return;
// //     }

// //     try {
// //       // Prepare the email data
// //       const emailData = {
// //         to: recipient,
// //         subject: subject,
// //         html: htmlContent, // Use the generated HTML content
// //       };

// //       // Send the email via your API endpoint
// //       const response = await fetch("http://localhost:5000/send-email", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(emailData),
// //       });

// //       if (response.ok) {
// //         toast.success("Test email sent successfully!");
// //       } else {
// //         throw new Error("Failed to send test email.");
// //       }
// //     } catch (error) {
// //       console.error("Error sending test email:", error);
// //       toast.error("Failed to send test email. Please try again.");
// //     }
// //   };

// //   return (
// //     <div className="p-4 shadow-sm flex justify-between items-center">
// //       <Image src={"/logo.svg"} alt="logo" width={200} height={150} />
// //       <div className="flex gap-3 ">
// //         <Button
// //           variant="ghost"
// //           onClick={() => setScreenSize("desktop")}
// //           className={`${
// //             screenSize == "desktop" && "bg-purple-100 text-primary"
// //           }`}
// //         >
// //           <Monitor />
// //           Desktop
// //         </Button>
// //         <Button
// //           variant="ghost"
// //           onClick={() => setScreenSize("mobile")}
// //           className={`${
// //             screenSize == "mobile" && "bg-purple-100 text-primary"
// //           }`}
// //         >
// //           <Smartphone />
// //           Mobile
// //         </Button>
// //       </div>
// //       <div className="flex gap-3">
// //         {/* Button to trigger HTML code retrieval */}
// //         <Button
// //           variant="ghost"
// //           className="hover:text-primary hover:bg-purple-100"
// //           onClick={() => viewHTMLCode()}
// //         >
// //           <Code />
// //         </Button>

// //         {/* Button to send a test email */}
// //         <Button variant="outline" onClick={handleSendTestEmail}>
// //           Send Test Email
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default EditorHeader;

"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Code, Monitor, Smartphone } from "lucide-react";
import { useEmailTemplate, useScreenSize } from "@/app/provider";
import { useParams } from "next/navigation";
// import { useCompose } from "@/app/context/ComposeContext";
import DOMPurify from "dompurify";
import { useCompose } from "@/context/ComposeContext";

function EditorHeader({ viewHTMLCode }: { viewHTMLCode: () => void }) {
  const { screenSize, setScreenSize } = useScreenSize();
  const {
    recipient,
    setRecipient,
    subject,
    setSubject,
    previewHTML,
    setPreviewHTML,
    viewHTMLCode: htmlContent, // Get the HTML content from context
    setViewHTMLCode,
  } = useCompose();

  const { templateId } = useParams();

  const handleSendEmail = async () => {
    console.log("Send test email button clicked");

    if (!recipient || !subject || !htmlContent) {
      console.log("Missing fields", {
        recipient,
        subject,
        htmlContentLength: htmlContent?.length,
      });
      alert("Please fill in all fields before sending the test email.");
      return;
    }

    try {
      console.log("Preparing email data");
      const emailData = {
        recipient,
        subject,
        viewHTMLCode: htmlContent,
      };

      console.log("Email data prepared:", emailData);

      const response = await fetch("http://localhost:5000/send-email-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      console.log("Response received:", response.status, response.statusText);

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("Email sent successfully");
        alert(" email sent successfully!");
      } else {
        console.error("Error in response:", responseData);
        throw new Error(
          responseData.error || responseData.message || "Failed to send  email."
        );
      }
    } catch (error: any) {
      console.error("Error sending test email:", error);
      alert(`Failed to send test email: ${error.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    if (htmlContent) {
      // Sanitize the HTML content for the preview
      const sanitizedPreview = DOMPurify.sanitize(htmlContent);
      setPreviewHTML(sanitizedPreview); // Update the preview state
    }
  }, [htmlContent, setPreviewHTML]);

  return (
    <div className="p-4 shadow-sm flex justify-between items-center">
      <div className="w-1/3"></div>
      <div className="flex gap-3 w-1/3">
        <Button
          variant="ghost"
          onClick={() => setScreenSize("desktop")}
          className={`${
            screenSize == "desktop" && "bg-purple-100 text-primary"
          }`}
        >
          <Monitor />
          Desktop
        </Button>
        <Button
          variant="ghost"
          onClick={() => setScreenSize("mobile")}
          className={`${
            screenSize == "mobile" && "bg-purple-100 text-primary"
          }`}
        >
          <Smartphone />
          Mobile
        </Button>
      </div>
      <div className="flex gap-3 ">
        <Button
          variant="ghost"
          className="hover: text-primary hover:bg-purple-100"
          onClick={() => viewHTMLCode()} // Call the function passed as prop
        >
          <Code />
        </Button>

        <Button onClick={handleSendEmail} variant="outline">
          Send Test Email
        </Button>
      </div>
    </div>
  );
}

export default EditorHeader;
