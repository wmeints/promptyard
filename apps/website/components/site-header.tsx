import { Plus, Search } from "lucide-react";
import Link from "next/link";

import { SignInButton } from "@/components/sign-in-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu, type SessionUser } from "@/components/user-menu";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span aria-hidden className="size-7 rounded-md bg-primary" />
      <span className="text-lg font-semibold tracking-tight">Promptyard</span>
    </Link>
  );
}

function SearchBar() {
  // Mock search field — non-functional placeholder for the app shell.
  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        disabled
        aria-label="Search skills and agents"
        placeholder="Search skills & agents…"
        className="pl-9"
      />
    </div>
  );
}

export function SiteHeader({ user }: { user: SessionUser | null }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <SearchBar />
        <nav className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Button variant="outline">
                <Plus />
                Upload
              </Button>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Explore
              </Link>
              <SignInButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
