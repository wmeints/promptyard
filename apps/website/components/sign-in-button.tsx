"use client";

import { useState } from "react";

import { useAppError } from "@/components/app-error";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toSafeCallbackURL } from "@/lib/safe-callback-url";

interface SignInButtonProps {
  label?: string;
  size?: "default" | "lg";
  className?: string;
  /**
   * Where to return after a successful sign-in. Must be a same-site relative
   * path (off-site targets are clamped to the home page). Defaults to home.
   */
  callbackURL?: string;
}

export function SignInButton({
  label = "Sign in",
  size = "default",
  className,
  callbackURL = "/",
}: SignInButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const { setError, clearError } = useAppError();

  async function handleSignIn() {
    setIsPending(true);
    clearError();
    try {
      await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL: toSafeCallbackURL(callbackURL),
      });
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
