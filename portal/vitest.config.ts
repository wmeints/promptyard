import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, ".storybook"),
                        storybookScript: "npm run storybook -- --no-open",
                    }),
                ],
                test: {
                    name: "storybook",
                    exclude: ["node_modules/**"],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        instances: [{ browser: "chromium" }],
                    },
                    setupFiles: ["./.storybook/vitest.setup.ts"],
                },
            },
            {
                extends: true,
                plugins: [react()],
                test: {
                    name: "specs",
                    include: ["**/*.test.{ts,tsx}"],
                    exclude: ["node_modules/**"],
                    environment: "jsdom",
                    setupFiles: ["./vitest.setup.ts"],
                },
            },
        ],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                ".storybook/",
                ".next/",
                "coverage/",
                "**/*.config.*",
                "**/*.d.ts",
                "**/*.stories.*",
            ],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
