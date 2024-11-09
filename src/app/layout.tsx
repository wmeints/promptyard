import type { Metadata } from "next";
import "./globals.css";
import StackedLayout from "@/components/StackedLayout";


export const metadata: Metadata = {
  title: "Promptyard",
  description: "Up your prompt engineering game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">
        <StackedLayout>{children}</StackedLayout>
      </body>
    </html>
  );
}
