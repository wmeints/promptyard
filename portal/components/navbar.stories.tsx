import type { Meta, StoryObj } from "@storybook/nextjs"
import { Navbar } from "./navbar"

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithUser: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/get-session",
        method: "GET",
        status: 200,
        response: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            image: "https://github.com/github.png",
          },
          session: {
            token: "mock-token",
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
          },
        },
      },
    ],
  },
}

export const WithoutUser: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/get-session",
        method: "GET",
        status: 401,
        response: null,
      },
    ],
  },
}
