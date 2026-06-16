"use client";

import { AlertCircle, X } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";

interface AppErrorContextValue {
  error: string | null;
  setError: (message: string | null) => void;
  clearError: () => void;
}

const AppErrorContext = createContext<AppErrorContextValue | null>(null);

export function useAppError() {
  const context = useContext(AppErrorContext);
  if (!context) {
    throw new Error("useAppError must be used within an AppErrorProvider");
  }
  return context;
}

function AppErrorBar() {
  const { error, clearError } = useAppError();

  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex items-center gap-3 border-b border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:px-6"
    >
      <AlertCircle className="size-4 shrink-0" />
      <p className="flex-1">{error}</p>
      <button
        type="button"
        onClick={clearError}
        aria-label="Dismiss error"
        className="rounded-md p-1 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function AppErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const value = useMemo<AppErrorContextValue>(
    () => ({ error, setError, clearError: () => setError(null) }),
    [error],
  );

  return (
    <AppErrorContext.Provider value={value}>
      <AppErrorBar />
      {children}
    </AppErrorContext.Provider>
  );
}
