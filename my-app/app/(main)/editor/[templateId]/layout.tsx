// app/(main)/editor/[templateId]/layout.tsx
import { ComposeProvider } from "@/context/ComposeContext";

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ComposeProvider>{children}</ComposeProvider>;
}
