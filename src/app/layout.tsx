import type { Metadata } from "next";
import "./globals.css";
import { StackedLayout } from "@/components/catalyst/stacked-layout";
import AppNavigationBar from "@/components/AppNavigationBar";
import AppSideBar from "@/components/AppSideBar";


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
        <StackedLayout
          navbar={<AppNavigationBar />}
          sidebar={<AppSideBar />}
        >
          {children}
        </StackedLayout>
      </body>
    </html>
  );
}
