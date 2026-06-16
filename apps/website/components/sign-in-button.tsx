"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface SignInButtonProps {
  label?: string;
  size?: "default" | "lg";
  className?: string;
}

export function SignInButton({
  label = "Sign in",
  size = "default",
  className,
}: SignInButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleSignIn() {
    setIsPending(true);
    try {
      await authClient.signIn.oauth2({ providerId: "keycloak", callbackURL: "/" });
    } catch {
      // Sign-in redirect failed (e.g. Keycloak unreachable); re-enable the button.
      setIsPending(false);
    }
  }

  return (
    <Button size={size} className={className} disabled={isPending} onClick={handleSignIn}>
      {label}
    </Button>
  );
}
