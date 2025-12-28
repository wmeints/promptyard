import { Button } from "./button";
import { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Button,
  title: "Components/UI/Button",
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
    },
    disabled: {
      control: "boolean",
    },
    asChild: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    children: "→",
    "aria-label": "Icon button",
  },
};

export const IconSmall: Story = {
  args: {
    size: "icon-sm",
    children: "→",
    "aria-label": "Small icon button",
  },
};

export const IconLarge: Story = {
  args: {
    size: "icon-lg",
    children: "→",
    "aria-label": "Large icon button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        Continue
      </>
    ),
  },
};

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href="/test">Link styled as button</a>,
  },
};

export const DestructiveSmall: Story = {
  args: {
    variant: "destructive",
    size: "sm",
    children: "Delete",
  },
};

export const OutlineLarge: Story = {
  args: {
    variant: "outline",
    size: "lg",
    children: "Outlined Large",
  },
};

export const GhostIcon: Story = {
  args: {
    variant: "ghost",
    size: "icon",
    children: "✕",
    "aria-label": "Close",
  },
};

export const WithClickHandler: Story = {
  args: {
    children: "Click me",
    onClick: () => alert("Button clicked!"),
  },
};

export const InvalidState: Story = {
  args: {
    children: "Invalid Button",
    "aria-invalid": true,
  },
};
