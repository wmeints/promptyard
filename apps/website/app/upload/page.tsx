import { UploadCloud } from "lucide-react";
import type { Metadata } from "next";

import { SignInButton } from "@/components/sign-in-button";
import { Card } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/session";

import { UploadForm } from "./upload-form";

export const metadata: Metadata = { title: "Upload a skill · Promptyard" };

// The action processes a worst-case 10 MB / 500-file zip synchronously, so give
// the serverless function headroom beyond the default before it times out.
export const maxDuration = 60;

function SignInGate() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <UploadCloud className="size-10 text-muted-foreground" aria-hidden />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Sign in to upload</h1>
      <p className="mt-3 text-muted-foreground">
        You need to be signed in to upload a skill. We will bring you right back here afterwards.
      </p>
      <SignInButton label="Sign in to upload" size="lg" className="mt-8" callbackURL="/upload" />
    </div>
  );
}

export default async function UploadPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    return <SignInGate />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload a skill</h1>
      <p className="mt-2 text-muted-foreground">
        Upload a zip of your skill. We will parse each <code>skills/&lt;name&gt;/SKILL.md</code>,
        store its files, and add it to your library.
      </p>
      <Card className="mt-8 p-6">
        <UploadForm />
      </Card>
    </div>
  );
}
