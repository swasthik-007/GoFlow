import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import "./globals.css";
import { ComposeProvider } from "@/context/ComposeContext";
import MainLayout from "./components/MainLayout";
// import MainLayout from "@/components/MainLayout";
// import MainLayout from "./components/MainLayout";
// import { ComposeProvider } from "./context/ComposeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider
          afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
        >
          <Provider>
            <ComposeProvider>
              <MainLayout>{children}</MainLayout>
            </ComposeProvider>
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}
