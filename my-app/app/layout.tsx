import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider
          afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}>
          <>{children}</>
        </ClerkProvider>
      </body>
    </html>
  );
}
