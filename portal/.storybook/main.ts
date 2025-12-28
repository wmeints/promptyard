import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        {
            name: "@storybook/addon-vitest",
            options: {
                // Options for the Vitest addon
                configFile: "../vitest.workspace.ts",
            },
        },
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
    ],
    framework: "@storybook/nextjs-vite",
    staticDirs: ["..\\public"],
    async viteFinal(config) {
        // Merge custom Vitest config
        return config;
    },
};
export default config;
