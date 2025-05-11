// app/(main)/layout.tsx
import { ComposeProvider } from "@/context/ComposeContext";

export default function MainLayout({ children }) {
  return (
    <ComposeProvider>
      {children}
    </ComposeProvider>
  );
}
