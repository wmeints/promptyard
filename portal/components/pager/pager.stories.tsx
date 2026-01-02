import { Meta, StoryObj } from "@storybook/react-vite";
import { Pager } from "./pager";

const meta = {
    component: Pager,
    title: "Components/UI/Pager",
    argTypes: {
        currentPage: {
            control: { type: "number", min: 1 },
        },
        totalPages: {
            control: { type: "number", min: 1 },
        },
    },
    args: {
        onPageChange: () => {},
    },
} satisfies Meta<typeof Pager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        currentPage: 1,
        totalPages: 10,
    },
};

export const MiddlePage: Story = {
    args: {
        currentPage: 5,
        totalPages: 10,
    },
};

export const LastPage: Story = {
    args: {
        currentPage: 10,
        totalPages: 10,
    },
};

export const SinglePage: Story = {
    args: {
        currentPage: 1,
        totalPages: 1,
    },
};

export const TwoPages: Story = {
    args: {
        currentPage: 1,
        totalPages: 2,
    },
};
