"use client";

import { useSession } from "next-auth/react";
import PageContent from "./PageContent";

function AccessDenied() {
    return (
        <PageContent title="You're not logged in">
            <div className="prose">
                <p>You must be signed in to view this page.</p>
            </div>
        </PageContent>
    )
}

export default function RestrictedContent({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    return session ? <>{children}</> : <AccessDenied />;
}