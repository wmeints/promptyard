/**
 * Prompt by slug API route
 * Handles retrieval of individual prompts by their slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { prompts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/prompts/:slug
 * Retrieves a prompt by its slug
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    const [prompt] = await db
      .select()
      .from(prompts)
      .where(eq(prompts.slug, slug))
      .limit(1);

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
