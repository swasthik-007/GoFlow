// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@clerk/nextjs";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function OAuthRedirect() {
//   const { userId } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (userId) {
//       (async () => {
//         try {
//           const { data } = await axios.get("http://localhost:5000/auth-url"); // Fetch OAuth URL
//           window.location.href = data.url; // Redirect user to OAuth flow
//         } catch (error) {
//           console.error("OAuth Error:", error);
//           alert("Failed to connect to Gmail. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       })();
//     }
//   }, [userId]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       {loading ? "Redirecting to Gmail OAuth..." : "Something went wrong!"}
//     </div>
//   );
// }

// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function OAuthRedirect() {
//   const router = useRouter();

//   useEffect(() => {
//     const fetchOAuthUrl = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5000/auth-url"); // Fetch OAuth URL
//         window.location.href = data.url; // Redirect to Gmail OAuth
//       } catch (error) {
//         console.error("OAuth Error:", error);
//         alert("Failed to connect to Gmail.");
//         router.push("/dashboard"); // Fallback to dashboard if error occurs
//       }
//     };

//     fetchOAuthUrl();
//   }, []);

//   return <p>Redirecting to Gmail...</p>;
// }

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function OAuthRedirect() {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth(); // Check if user is signed in

  useEffect(() => {
    const fetchOAuthUrl = async () => {
      if (!isSignedIn) {
        router.push("/sign-in"); // Redirect to sign-in if not signed in
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/auth-url", {
          params: { userId }, // Send user ID if needed
        });

        window.location.href = data.url; // Redirect to Gmail OAuth
      } catch (error) {
        console.error("OAuth Error:", error);
        alert("Failed to connect to Gmail.");
        router.push("/"); // Fallback if OAuth fails
      }
    };

    fetchOAuthUrl();
  }, [isSignedIn, router, userId]);

  return <p>Redirecting to Gmail...</p>;
}