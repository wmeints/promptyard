import { Meta, StoryObj } from "@storybook/nextjs";
import { FileText, Sparkles, Bot, FolderGit2, MoreVertical } from "lucide-react";
import {
  ContentCard,
  ContentCardHeader,
  ContentCardIcon,
  ContentCardTitle,
  ContentCardDescription,
  ContentCardTags,
  ContentCardStats,
  ContentCardFooter,
} from "./content-card";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const meta = {
  component: ContentCard,
  title: "Components/UI/ContentCard",
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={FileText} />
        <ContentCardTitle>My Prompt Template</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        A helpful prompt for generating code documentation with best practices.
      </ContentCardDescription>
      <ContentCardTags tags={["coding", "documentation", "gpt-4"]} />
      <ContentCardStats favorites={42} />
    </ContentCard>
  ),
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={Sparkles} />
        <ContentCardTitle>Code Review Skill</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        Automated code review with suggestions for improvements and best practices.
      </ContentCardDescription>
      <ContentCardTags tags={["review", "automation", "quality"]} />
      <ContentCardStats favorites={128} />
    </ContentCard>
  ),
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={Bot} />
        <ContentCardTitle>Assistant Agent</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        A conversational agent that helps with daily tasks and questions.
      </ContentCardDescription>
      <ContentCardTags tags={["assistant", "conversational"]} />
      <ContentCardStats favorites={256} />
    </ContentCard>
  ),
};

export const Small: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={FileText} />
        <ContentCardTitle>Quick Prompt</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription truncate>
        A short and simple prompt for quick tasks.
      </ContentCardDescription>
      <ContentCardTags tags={["quick"]} />
      <ContentCardStats favorites={5} />
    </ContentCard>
  ),
};

export const Large: Story = {
  args: {
    size: "lg",
  },
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={FolderGit2} />
        <ContentCardTitle>Enterprise Repository</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        A comprehensive collection of prompts, skills, and agents for enterprise
        use cases including customer support, documentation, and code generation.
      </ContentCardDescription>
      <ContentCardTags tags={["enterprise", "collection", "support", "docs"]} max={3} />
      <ContentCardStats favorites={1024} />
    </ContentCard>
  ),
};

export const WithTruncatedDescription: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={FileText} />
        <ContentCardTitle>Long Description Example</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription truncate>
        This is a very long description that should be truncated after two lines.
        It contains a lot of text that would normally overflow and make the card
        too tall. The truncate prop ensures consistent card heights across the UI.
      </ContentCardDescription>
      <ContentCardTags tags={["example", "truncation"]} />
      <ContentCardStats favorites={15} />
    </ContentCard>
  ),
};

export const WithManyTags: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={Sparkles} />
        <ContentCardTitle>Multi-Purpose Skill</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        A versatile skill that covers many use cases.
      </ContentCardDescription>
      <ContentCardTags
        tags={["coding", "writing", "analysis", "research", "automation", "testing"]}
        max={3}
      />
      <ContentCardStats favorites={89} />
    </ContentCard>
  ),
};

export const WithFooterButtons: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={FileText} />
        <ContentCardTitle>Editable Prompt</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        A prompt template that can be edited and customized.
      </ContentCardDescription>
      <ContentCardTags tags={["editable", "template"]} />
      <ContentCardStats favorites={23} />
      <ContentCardFooter>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          Duplicate
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </ContentCardFooter>
    </ContentCard>
  ),
};

export const WithDropdownMenu: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={Bot} />
        <ContentCardTitle>Agent with Actions</ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        An agent with a dropdown menu for additional actions.
      </ContentCardDescription>
      <ContentCardTags tags={["agent", "actions"]} />
      <ContentCardStats favorites={67} />
      <ContentCardFooter>
        <Button variant="outline" size="sm">
          Run
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ContentCardFooter>
    </ContentCard>
  ),
};

export const WithClickableTitle: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardHeader>
        <ContentCardIcon icon={FolderGit2} />
        <ContentCardTitle asChild>
          <a href="#repository-detail">Linked Repository</a>
        </ContentCardTitle>
      </ContentCardHeader>
      <ContentCardDescription>
        Click the title to navigate to the repository details page.
      </ContentCardDescription>
      <ContentCardTags tags={["repository", "linked"]} />
      <ContentCardStats favorites={34} />
    </ContentCard>
  ),
};

export const MinimalCard: Story = {
  render: (args) => (
    <ContentCard {...args}>
      <ContentCardTitle>Simple Card</ContentCardTitle>
      <ContentCardDescription>
        A minimal card with just a title and description.
      </ContentCardDescription>
    </ContentCard>
  ),
};

export const AllContentTypes: Story = {
  decorators: [
    (Story) => (
      <div className="grid gap-4 max-w-3xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <ContentCard variant="outline">
        <ContentCardHeader>
          <ContentCardIcon icon={FileText} />
          <ContentCardTitle>Prompt Template</ContentCardTitle>
        </ContentCardHeader>
        <ContentCardDescription truncate>
          A reusable prompt for code documentation generation.
        </ContentCardDescription>
        <ContentCardTags tags={["prompt", "docs"]} />
        <ContentCardStats favorites={42} />
      </ContentCard>

      <ContentCard variant="outline">
        <ContentCardHeader>
          <ContentCardIcon icon={Sparkles} />
          <ContentCardTitle>Code Review Skill</ContentCardTitle>
        </ContentCardHeader>
        <ContentCardDescription truncate>
          Automated code review with best practice suggestions.
        </ContentCardDescription>
        <ContentCardTags tags={["skill", "review"]} />
        <ContentCardStats favorites={128} />
      </ContentCard>

      <ContentCard variant="outline">
        <ContentCardHeader>
          <ContentCardIcon icon={Bot} />
          <ContentCardTitle>Assistant Agent</ContentCardTitle>
        </ContentCardHeader>
        <ContentCardDescription truncate>
          A conversational agent for daily tasks and questions.
        </ContentCardDescription>
        <ContentCardTags tags={["agent", "assistant"]} />
        <ContentCardStats favorites={256} />
      </ContentCard>

      <ContentCard variant="outline">
        <ContentCardHeader>
          <ContentCardIcon icon={FolderGit2} />
          <ContentCardTitle>Prompt Repository</ContentCardTitle>
        </ContentCardHeader>
        <ContentCardDescription truncate>
          A collection of curated prompts for various use cases.
        </ContentCardDescription>
        <ContentCardTags tags={["repository", "collection"]} />
        <ContentCardStats favorites={512} />
      </ContentCard>
    </>
  ),
};
