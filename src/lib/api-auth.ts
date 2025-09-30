import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

import type { NextRequest } from 'next/server';
import type { z } from 'zod'; // Optional: for request validation

export interface AuthenticatedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface ApiContext {
  user: AuthenticatedUser
  request: NextRequest
  params?: Record<string, string>
}

export interface ApiAuthOptions {
  requireAuth?: boolean
  validateUser?: boolean
}

/**
 * Enhanced API authentication with options
 */
export async function validateApiAuth(
  request: NextRequest,
  options: ApiAuthOptions = {},
): Promise<{ success: true; user: AuthenticatedUser } | { success: false; error: NextResponse }> {
  const { requireAuth = true, validateUser = true } = options;

  try {
    if (!requireAuth) {
      // For public endpoints, still try to get user if available
      const session = await getServerSession(authOptions);
      const user = session?.user?.id ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      } : null;

      return { success: true, user: user as AuthenticatedUser };
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Unauthorized',
            message: 'Please sign in to access this resource',
            code: 'AUTH_REQUIRED',
          },
          { status: 401 },
        ),
      };
    }

    let user: AuthenticatedUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };

    // Optional: Validate user exists in database
    if (validateUser) {
      const dbUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // Add role field if you have user roles
          // role: true,
        },
      });

      if (!dbUser) {
        return {
          success: false,
          error: NextResponse.json(
            {
              error: 'User not found',
              message: 'Your account may have been deleted',
              code: 'USER_NOT_FOUND',
            },
            { status: 404 },
          ),
        };
      }

      user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      };

      // Role-based access control (if needed)
      // if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
      //   return {
      //     success: false,
      //     error: NextResponse.json(
      //       { error: 'Insufficient permissions' },
      //       { status: 403 }
      //     )
      //   }
      // }
    }

    return { success: true, user };
  } catch (error) {
    console.error('API Auth validation error:', error);
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Authentication validation failed',
          code: 'AUTH_ERROR',
        },
        { status: 500 },
      ),
    };
  }
}

/**
 * Enhanced HOF with request and params
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function withApiAuth<T extends Record<string, string> = {}>(
  handler: (context: ApiContext & { params?: T }) => Promise<NextResponse>,
  options: ApiAuthOptions = {},
) {
  return async (
    request: NextRequest,
    { params }: { params?: T } = {},
  ): Promise<NextResponse> => {
    const authResult = await validateApiAuth(request, options);

    if (!authResult.success) {
      return authResult.error;
    }

    try {
      return await handler({
        user: authResult.user,
        request,
        params,
      });
    } catch (error) {
      console.error('API route handler error:', error);
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'An unexpected error occurred',
          code: 'HANDLER_ERROR',
        },
        { status: 500 },
      );
    }
  };
}

/**
 * Request body validation helper
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Invalid request data',
            details: result.error.issues,
            code: 'VALIDATION_ERROR',
          },
          { status: 400 },
        ),
      };
    }

    return { success: true, data: result.data };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
          code: 'INVALID_JSON',
        },
        { status: 400 },
      ),
    };
  }
}
