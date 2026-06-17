import { Plus } from "lucide-react";
import Link from "next/link";

import { ContentCard } from "@/components/home/content-card";
import { recentUpdates } from "@/components/home/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tabs = ["All", "Skills", "Agents"] as const;

function UploadHero() {
  return (
    <Card className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Get started
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Upload your first skill or agent
        </h1>
        <p className="mt-3 text-muted-foreground">
          Publish a skill or agent and it&apos;ll show up here for the community — and in your
          profile.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/upload">
              <Plus />
              Upload
            </Link>
          </Button>
          <Button variant="outline">Import from file</Button>
        </div>
      </div>
      <div className="flex h-44 items-center justify-center rounded-lg border-2 border-dashed bg-muted/40">
        <span className="rounded-md bg-background px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
          drop a .md / .json skill
        </span>
      </div>
    </Card>
  );
}

function RecentUpdates() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Recent updates</h2>
        {/* Static filter tabs — non-functional in the app shell. */}
        <div className="flex items-center gap-1 rounded-md bg-muted p-1">
          {tabs.map((tab, index) => (
            <span
              key={tab}
              className={
                index === 0
                  ? "rounded bg-primary px-3 py-1 text-sm font-medium text-primary-foreground"
                  : "px-3 py-1 text-sm font-medium text-muted-foreground"
              }
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recentUpdates.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export function SignedInHome() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <UploadHero />
      <RecentUpdates />
    </div>
  );
}
