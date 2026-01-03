import { Meta, StoryObj } from "@storybook/react-vite"
import { RepositoryHeader } from "./repository-header"

const meta = {
  component: RepositoryHeader,
  title: "Components/Repository/RepositoryHeader",
  args: {
    onCreateSkill: () => {},
    onCreatePrompt: () => {},
    onCreateAgent: () => {},
    onEditDetails: () => {},
    onChangeSettings: () => {},
    onManagePermissions: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RepositoryHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "My Repository",
    description: "A collection of prompts, skills, and agents for productivity.",
  },
}

export const WithLongDescription: Story = {
  args: {
    name: "Enterprise AI Toolkit",
    description:
      "A comprehensive collection of AI-powered tools, prompts, and agents designed for enterprise use cases including customer support automation, documentation generation, code review assistance, and data analysis workflows.",
  },
}

export const WithoutDescription: Story = {
  args: {
    name: "Personal Repository",
  },
}

export const WithShortName: Story = {
  args: {
    name: "AI",
    description: "Artificial intelligence resources.",
  },
}

export const WithLongName: Story = {
  args: {
    name: "My Super Long Repository Name That Might Wrap",
    description: "Testing how the layout handles long names.",
  },
}
