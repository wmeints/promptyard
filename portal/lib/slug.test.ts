import { describe, it, expect } from "vitest";
import { generateSlug, findUniqueSlug } from "./slug";

describe("slug", () => {
    describe("generateSlug", () => {
        describe("when given a simple string", () => {
            it("converts to lowercase", () => {
                expect(generateSlug("Hello World")).toBe("hello-world");
            });

            it("replaces spaces with hyphens", () => {
                expect(generateSlug("my prompt name")).toBe("my-prompt-name");
            });
        });

        describe("when given a string with underscores", () => {
            it("replaces underscores with hyphens", () => {
                expect(generateSlug("my_prompt_name")).toBe("my-prompt-name");
            });
        });

        describe("when given a string with special characters", () => {
            it("removes non-alphanumeric characters", () => {
                expect(generateSlug("Hello! World?")).toBe("hello-world");
            });

            it("handles symbols and punctuation", () => {
                expect(generateSlug("Test@#$%Name")).toBe("testname");
            });

            it("preserves numbers", () => {
                expect(generateSlug("Version 2.0")).toBe("version-20");
            });
        });

        describe("when given a string with multiple spaces or hyphens", () => {
            it("collapses multiple spaces into a single hyphen", () => {
                expect(generateSlug("hello    world")).toBe("hello-world");
            });

            it("collapses multiple hyphens", () => {
                expect(generateSlug("hello---world")).toBe("hello-world");
            });
        });

        describe("when given a string with leading or trailing whitespace", () => {
            it("trims and handles leading/trailing hyphens", () => {
                expect(generateSlug("  hello world  ")).toBe("hello-world");
            });

            it("removes leading hyphens from special characters", () => {
                expect(generateSlug("---hello")).toBe("hello");
            });

            it("removes trailing hyphens from special characters", () => {
                expect(generateSlug("hello---")).toBe("hello");
            });
        });

        describe("when given edge cases", () => {
            it("handles empty string", () => {
                expect(generateSlug("")).toBe("");
            });

            it("handles string with only special characters", () => {
                expect(generateSlug("@#$%")).toBe("");
            });
        });
    });

    describe("findUniqueSlug", () => {
        describe("when the base slug is available", () => {
            it("returns the base slug unchanged", () => {
                const result = findUniqueSlug("my-slug", ["other-slug", "another-slug"]);
                expect(result).toBe("my-slug");
            });

            it("returns base slug when existing list is empty", () => {
                const result = findUniqueSlug("my-slug", []);
                expect(result).toBe("my-slug");
            });
        });

        describe("when the base slug already exists", () => {
            it("appends -1 suffix", () => {
                const result = findUniqueSlug("my-slug", ["my-slug"]);
                expect(result).toBe("my-slug-1");
            });
        });

        describe("when multiple suffixes are taken", () => {
            it("finds the next available suffix", () => {
                const result = findUniqueSlug("my-slug", [
                    "my-slug",
                    "my-slug-1",
                    "my-slug-2",
                ]);
                expect(result).toBe("my-slug-3");
            });

            it("handles gaps in suffix sequence", () => {
                const result = findUniqueSlug("my-slug", [
                    "my-slug",
                    "my-slug-2",
                    "my-slug-3",
                ]);
                expect(result).toBe("my-slug-1");
            });
        });

        describe("when similar but different slugs exist", () => {
            it("does not get confused by similar prefixes", () => {
                const result = findUniqueSlug("test", [
                    "test-prompt",
                    "testing",
                ]);
                expect(result).toBe("test");
            });
        });
    });
});
