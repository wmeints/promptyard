/**
 * Prompts API route
 * Handles prompt submission and retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { prompts } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { generateSlug, generateUniqueSlug } from '@/lib/utils/slug';
import { auth } from '@/lib/auth';

/**
 * POST /api/prompts
 * Creates a new prompt
 */
export async function POST(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, tags } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate tags if provided
    const validatedTags = Array.isArray(tags) 
      ? tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
      : [];

    // Generate base slug from title
    const baseSlug = generateSlug(title);

    // Get all existing slugs that start with the base slug
    const existingPrompts = await db
      .select({ slug: prompts.slug })
      .from(prompts)
      .where(sql`${prompts.slug} LIKE ${baseSlug + '%'}`);

    const existingSlugs = existingPrompts.map(p => p.slug);

    // Generate unique slug
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

    // Insert the new prompt
    const [newPrompt] = await db
      .insert(prompts)
      .values({
        title: title.trim(),
        content: content.trim(),
        slug: uniqueSlug,
        tags: validatedTags,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/prompts
 * Lists all prompts (can be filtered later)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = db.select().from(prompts);

    if (userId) {
      query = query.where(eq(prompts.userId, userId));
    }

    const allPrompts = await query;

    return NextResponse.json(allPrompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
