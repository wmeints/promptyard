import { getServerSession } from "next-auth";
import PageContent from "./PageContent";
import { authOptions } from "@/lib/authentication";

function AccessDenied() {
    return (
        <PageContent title="You're not logged in">
            <div className="prose">
                <p>You must be signed in to view this page.</p>
            </div>
        </PageContent>
    )
}

export default async function RestrictedContent({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    return session ? <>{children}</> : <AccessDenied />;
}