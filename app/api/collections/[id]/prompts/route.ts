/**
 * Example API route for adding a prompt to a collection
 * Demonstrates enforcing the rule: user must be owner of both prompt and collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { promptCollections } from '@/lib/db/schema/prompts';
import { validateAddPromptToCollection } from '@/lib/auth';

/**
 * POST /api/collections/[id]/prompts
 * Add a prompt to a collection (requires owner permission on both)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collectionId = parseInt(params.id);
    
    if (isNaN(collectionId)) {
      return NextResponse.json(
        { error: 'Invalid collection ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { promptId } = body;

    if (!promptId || isNaN(parseInt(promptId))) {
      return NextResponse.json(
        { error: 'Invalid prompt ID' },
        { status: 400 }
      );
    }

    // Get the current user ID from session
    // Note: In production, you would get this from your auth system (e.g., BetterAuth)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate that the user can add this prompt to this collection
    // User must be owner of both the prompt and the collection
    const validation = await validateAddPromptToCollection(
      userId,
      parseInt(promptId),
      collectionId
    );
    
    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 403 }
      );
    }

    // Add the prompt to the collection
    await db.insert(promptCollections).values({
      promptId: parseInt(promptId),
      collectionId,
    });

    return NextResponse.json(
      { message: 'Prompt added to collection successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding prompt to collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
