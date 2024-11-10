import RestrictedContent from "@/components/shared/RestrictedContent";
import PageContent from "@/components/shared/PageContent";
import BrowsePrompts from "../../components/prompts/BrowsePrompts";

export default async function PromptsPage() {
  return (
    <RestrictedContent>
      <PageContent title="My Prompts">
        <BrowsePrompts />
      </PageContent>
    </RestrictedContent>
  );
}
