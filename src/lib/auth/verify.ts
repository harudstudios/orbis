import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase/admin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
}

/**
 * Extracts and verifies the Firebase ID token from the Authorization header.
 * Returns the decoded user or a 401 response.
 */
export async function verifyAuth(
  request: NextRequest,
): Promise<AuthenticatedUser | NextResponse> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

/**
 * Type guard to check if verifyAuth returned a user or an error response.
 */
export function isAuthenticated(
  result: AuthenticatedUser | NextResponse,
): result is AuthenticatedUser {
  return "uid" in result;
}
