import RestrictedContent from "@/components/RestrictedContent";
import PageContent from "@/components/PageContent";
import PromptList from "./PromptList";

export default async function PromptsPage() {
  return (
    <RestrictedContent>
      <PageContent title="My Prompts">
        <PromptList />
      </PageContent>
    </RestrictedContent>
  );
}
