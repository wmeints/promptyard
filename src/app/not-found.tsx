import PageContent from "@/components/shared/PageContent";

export default function NotFound() {
    return (
        <PageContent title="Page not found">
            <div className="prose">
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </PageContent>
    )
}