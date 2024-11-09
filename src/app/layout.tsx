import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Promptyard",
  description: "Up your prompt engineering game for free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
