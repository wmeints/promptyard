import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import * as projectAnnotations from "./preview";

// Set up Storybook project annotations for Vitest
const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);
