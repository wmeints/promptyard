import { GitHubSignInButton } from "./github-signin-button";
import { StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const meta = {
    component: GitHubSignInButton,
    title: "Components/Auth/GitHubSignInButton",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        
        // Check if the button is rendered
        const button = canvas.getByRole('button');
        await expect(button).toBeInTheDocument();
        
        // Check button text
        await expect(button).toHaveTextContent('Continue with GitHub');
    },
};
