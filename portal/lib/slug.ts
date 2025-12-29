import { db } from "@/db";
import { and, eq, like, sql } from "drizzle-orm";
import * as schema from "@/db/schema";

/**
 * Converts a string to a URL-friendly slug.
 * - Converts to lowercase
 * - Replaces spaces and underscores with hyphens
 * - Removes non-alphanumeric characters except hyphens
 * - Collapses multiple consecutive hyphens
 * - Trims leading/trailing hyphens
 */
export function generateSlug(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric except hyphens
        .replace(/-+/g, "-") // Collapse multiple hyphens
        .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Generates a unique slug for a repository by checking for collisions
 * and appending a numeric suffix if necessary.
 */
export async function generateUniqueRepositorySlug(
    name: string,
    excludeId?: string
): Promise<string> {
    const baseSlug = generateSlug(name);

    // Find all existing slugs that match the pattern
    const existingSlugs = await db
        .select({ slug: schema.repository.slug })
        .from(schema.repository)
        .where(
            and(
                like(schema.repository.slug, `${baseSlug}%`),
                excludeId ? sql`${schema.repository.id} != ${excludeId}` : undefined
            )
        );

    return findUniqueSlug(
        baseSlug,
        existingSlugs.map((r) => r.slug)
    );
}

/**
 * Generates a unique slug for a prompt within a repository by checking
 * for collisions and appending a numeric suffix if necessary.
 */
export async function generateUniquePromptSlug(
    title: string,
    repositoryId: string,
    excludeId?: string
): Promise<string> {
    const baseSlug = generateSlug(title);

    const existingSlugs = await db
        .select({ slug: schema.prompt.slug })
        .from(schema.prompt)
        .where(
            and(
                eq(schema.prompt.repositoryId, repositoryId),
                like(schema.prompt.slug, `${baseSlug}%`),
                excludeId ? sql`${schema.prompt.id} != ${excludeId}` : undefined
            )
        );

    return findUniqueSlug(
        baseSlug,
        existingSlugs.map((p) => p.slug)
    );
}

/**
 * Generates a unique slug for a skill within a repository by checking
 * for collisions and appending a numeric suffix if necessary.
 */
export async function generateUniqueSkillSlug(
    title: string,
    repositoryId: string,
    excludeId?: string
): Promise<string> {
    const baseSlug = generateSlug(title);

    const existingSlugs = await db
        .select({ slug: schema.skill.slug })
        .from(schema.skill)
        .where(
            and(
                eq(schema.skill.repositoryId, repositoryId),
                like(schema.skill.slug, `${baseSlug}%`),
                excludeId ? sql`${schema.skill.id} != ${excludeId}` : undefined
            )
        );

    return findUniqueSlug(
        baseSlug,
        existingSlugs.map((s) => s.slug)
    );
}

/**
 * Generates a unique slug for an agent within a repository by checking
 * for collisions and appending a numeric suffix if necessary.
 */
export async function generateUniqueAgentSlug(
    name: string,
    repositoryId: string,
    excludeId?: string
): Promise<string> {
    const baseSlug = generateSlug(name);

    const existingSlugs = await db
        .select({ slug: schema.agent.slug })
        .from(schema.agent)
        .where(
            and(
                eq(schema.agent.repositoryId, repositoryId),
                like(schema.agent.slug, `${baseSlug}%`),
                excludeId ? sql`${schema.agent.id} != ${excludeId}` : undefined
            )
        );

    return findUniqueSlug(
        baseSlug,
        existingSlugs.map((a) => a.slug)
    );
}

/**
 * Finds a unique slug given a base slug and list of existing slugs.
 * If the base slug is available, returns it. Otherwise, appends
 * numeric suffixes (-1, -2, etc.) until a unique slug is found.
 */
export function findUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
    }

    // Build a set for O(1) lookup
    const slugSet = new Set(existingSlugs);

    // Find the next available suffix
    let suffix = 1;
    while (slugSet.has(`${baseSlug}-${suffix}`)) {
        suffix++;
    }

    return `${baseSlug}-${suffix}`;
}
