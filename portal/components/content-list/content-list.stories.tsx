import { Meta, StoryObj } from "@storybook/react-vite"
import { FileText, Sparkles, Bot } from "lucide-react"
import { ContentList } from "./content-list"
import {
  ContentCard,
  ContentCardHeader,
  ContentCardIcon,
  ContentCardTitle,
  ContentCardDescription,
  ContentCardTags,
  ContentCardStats,
} from "@/components/content-card"

interface SampleItem {
  id: string
  title: string
  description: string
  tags: string[]
  favorites: number
  type: "prompt" | "skill" | "agent"
}

const sampleItems: SampleItem[] = [
  {
    id: "1",
    title: "Code Documentation Prompt",
    description: "Generate comprehensive documentation for your codebase.",
    tags: ["documentation", "code"],
    favorites: 42,
    type: "prompt",
  },
  {
    id: "2",
    title: "Code Review Skill",
    description: "Automated code review with suggestions for improvements.",
    tags: ["review", "automation"],
    favorites: 128,
    type: "skill",
  },
  {
    id: "3",
    title: "Assistant Agent",
    description: "A conversational agent that helps with daily tasks.",
    tags: ["assistant", "chat"],
    favorites: 256,
    type: "agent",
  },
  {
    id: "4",
    title: "Test Generator",
    description: "Generate unit tests for your functions automatically.",
    tags: ["testing", "automation"],
    favorites: 89,
    type: "skill",
  },
  {
    id: "5",
    title: "API Documentation",
    description: "Create API documentation from code comments.",
    tags: ["api", "documentation"],
    favorites: 67,
    type: "prompt",
  },
  {
    id: "6",
    title: "Debug Helper",
    description: "An agent that helps identify and fix bugs in code.",
    tags: ["debugging", "assistant"],
    favorites: 145,
    type: "agent",
  },
]

const getIconForType = (type: string) => {
  switch (type) {
    case "prompt":
      return FileText
    case "skill":
      return Sparkles
    case "agent":
      return Bot
    default:
      return FileText
  }
}

const renderSampleItem = (item: SampleItem) => (
  <ContentCard variant="outline">
    <ContentCardHeader>
      <ContentCardIcon icon={getIconForType(item.type)} />
      <ContentCardTitle>{item.title}</ContentCardTitle>
    </ContentCardHeader>
    <ContentCardDescription truncate>{item.description}</ContentCardDescription>
    <ContentCardTags tags={item.tags} max={2} />
    <ContentCardStats favorites={item.favorites} />
  </ContentCard>
)

const meta: Meta = {
  title: "Components/UI/ContentList",
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ContentList items={sampleItems} renderItem={renderSampleItem} />
  ),
}

export const WithPagination: Story = {
  render: () => (
    <ContentList
      items={sampleItems.slice(0, 3)}
      renderItem={renderSampleItem}
      currentPage={1}
      totalPages={3}
      onPageChange={() => {}}
    />
  ),
}

export const MiddlePage: Story = {
  render: () => (
    <ContentList
      items={sampleItems.slice(0, 3)}
      renderItem={renderSampleItem}
      currentPage={2}
      totalPages={3}
      onPageChange={() => {}}
    />
  ),
}

export const EmptyState: Story = {
  render: () => (
    <ContentList
      items={[]}
      renderItem={renderSampleItem}
      emptyMessage="No prompts found in this repository."
    />
  ),
}

export const CustomEmptyMessage: Story = {
  render: () => (
    <ContentList
      items={[]}
      renderItem={renderSampleItem}
      emptyMessage="Create your first skill to get started!"
    />
  ),
}

export const SingleItem: Story = {
  render: () => (
    <ContentList items={sampleItems.slice(0, 1)} renderItem={renderSampleItem} />
  ),
}

export const TwoItems: Story = {
  render: () => (
    <ContentList items={sampleItems.slice(0, 2)} renderItem={renderSampleItem} />
  ),
}
