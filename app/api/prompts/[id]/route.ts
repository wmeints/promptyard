/**
 * Example API route for deleting a prompt
 * Demonstrates how to use the authorization system in a Next.js API route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/connection';
import { prompts } from '@/lib/db/schema/prompts';
import { validateDeletePrompt } from '@/lib/auth';
import { eq } from 'drizzle-orm';

/**
 * DELETE /api/prompts/[id]
 * Delete a prompt (requires owner permission)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promptId = parseInt(params.id);
    
    if (isNaN(promptId)) {
      return NextResponse.json(
        { error: 'Invalid prompt ID' },
        { status: 400 }
      );
    }

    // Get the current user ID from session
    // Note: In production, you would get this from your auth system (e.g., BetterAuth)
    // For this example, we'll assume it's passed in a header
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate that the user has permission to delete the prompt
    const validation = await validateDeletePrompt(userId, promptId);
    
    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 403 }
      );
    }

    // Delete the prompt
    await db.delete(prompts).where(eq(prompts.id, promptId));

    return NextResponse.json(
      { message: 'Prompt deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
