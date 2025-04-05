// components/MainLayout.tsx
"use client";

import { useUser } from "@clerk/nextjs";
// import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./theme-provider";
import { AppSidebar } from "./app-sidebar";
import Header from "./Header"; // Import the Header component
// import { ComposeProvider } from "../context/ComposeContext";
import Sidebar from "@/components/sidebars";
import { ComposeProvider } from "@/context/ComposeContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn } = useUser();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* <SidebarProvider> */}
        <ComposeProvider>
          <div className="">
            <main className="">{children}</main>
          </div>
        </ComposeProvider>
      {/* </SidebarProvider> */}
    </ThemeProvider>
  );
}