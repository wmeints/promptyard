/**
 * Better Auth API route handler
 * Handles all authentication endpoints including sign-up, sign-in, and sign-out
 */

import { auth } from '@/lib/better-auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
