import "./globals.css";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import { AppErrorProvider } from "@/components/app-error";
import { SiteHeader } from "@/components/site-header";
import { getCurrentSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// oxlint-disable-next-line new-cap
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// oxlint-disable-next-line new-cap
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "Share skills, agents, and tips about agentic engineering across your organization.",
  title: "Promptyard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <AppErrorProvider>
          <SiteHeader user={session?.user ?? null} />
          <main className="flex flex-1 flex-col">{children}</main>
        </AppErrorProvider>
      </body>
    </html>
  );
}
