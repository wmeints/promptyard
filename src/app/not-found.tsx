import { Divider } from "@/components/catalyst/divider";

export default function NotFound() {
    return (
        <>
            <h1 className="text-4xl font-bold">Page not found</h1>
            <Divider className="mt-4 mb-8" />
            <p>This is not the page you were looking for...</p>
        </>
    )
}