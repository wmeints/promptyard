import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { uploadRequest, user } from "@/db/schema";
import { Card } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/session";

type UploadSummaryPageProps = { params: Promise<{ batchId: string }> };

export default async function UploadSummaryPage({ params }: UploadSummaryPageProps) {
  const { batchId } = await params;

  const session = await getCurrentSession();
  if (!session?.user) {
    notFound();
  }

  const request = await db.query.uploadRequest.findFirst({
    where: eq(uploadRequest.id, batchId),
  });

  // Owner-scoped: a missing batch and someone else's batch both 404 so the
  // summary never leaks another user's upload history.
  if (!request || request.ownerId !== session.user.id) {
    notFound();
  }

  const owner = await db.query.user.findFirst({
    where: eq(user.id, request.ownerId),
    columns: { handle: true },
  });
  if (!owner) {
    notFound();
  }

  const created = request.results.filter((result) => result.status === "created");
  const failed = request.results.filter((result) => result.status === "failed");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload complete</h1>
      <p className="mt-2 text-muted-foreground">
        {created.length === 1 ? "1 skill was" : `${created.length} skills were`} added to your
        library
        {failed.length > 0 ? `, ${failed.length} could not be imported` : ""}.
      </p>

      {created.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Created
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {created.map((result) => (
              <li key={result.contentId ?? result.name}>
                <Card className="p-4">
                  <Link
                    href={`/${owner.handle}/skills/${result.name}`}
                    className="font-medium hover:underline"
                  >
                    {result.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{result.type}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {failed.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Failed
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {failed.map((result) => (
              <li key={`failed-${result.name}`}>
                <Card className="p-4">
                  <p className="font-medium">{result.name}</p>
                  <p className="mt-1 text-sm text-destructive">
                    {result.message ?? "Could not be imported."}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
