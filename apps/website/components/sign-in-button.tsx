"use client";

import { useState } from "react";

import { useAppError } from "@/components/app-error";
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
  const { setError, clearError } = useAppError();

  async function handleSignIn() {
    setIsPending(true);
    clearError();
    try {
      await authClient.signIn.oauth2({ providerId: "keycloak", callbackURL: "/" });
    } catch {
      // Sign-in redirect failed (e.g. Keycloak unreachable); surface the error.
      setError("We couldn't start the sign-in process. Please try again.");
    } finally {
      // Always re-enable: the flow may resolve client-side without navigating away.
      setIsPending(false);
    }
  }

  return (
    <Button size={size} className={className} disabled={isPending} onClick={handleSignIn}>
      {label}
    </Button>
  );
}
