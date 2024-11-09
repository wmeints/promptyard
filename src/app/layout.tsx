import type { Metadata } from "next";
import "./globals.css";
import StackedLayout from "@/components/StackedLayout";
import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Promptyard",
  description: "Up your prompt engineering game",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  session: Session | null | undefined;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">
        <StackedLayout>{children}</StackedLayout>
      </body>
    </html>
  );
}
