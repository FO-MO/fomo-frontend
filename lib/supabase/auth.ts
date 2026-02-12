/**
 * Supabase Authentication Utilities
 * Replaces the Strapi auth helper functions
 */
import { getSupabaseClient } from "./client";
import type { UserProfile } from "./types";
import { setUserCookie, clearAuthCookies } from "@/lib/cookies";

export interface AuthResponse {
  user: UserProfile | null;
  session: {
    access_token: string;
    refresh_token: string;
  } | null;
  error: {
    message: string;
    status?: number;
  } | null;
}

export interface SignUpOptions {
  username: string;
  email: string;
  password: string;
  usertype?: "student" | "employer" | "college";
}

export interface SignInOptions {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 * Replaces: strapiRegister()
 */
export async function signUp({
  username,
  email,
  password,
  usertype = "student",
}: SignUpOptions): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        usertype,
      },
    },
  });

  if (error) {
    return {
      user: null,
      session: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  // Store user info in cookie for compatibility with existing code
  if (data.user) {
    const userProfile: Partial<UserProfile> = {
      id: data.user.id,
      email: data.user.email || email,
      username: username,
      usertype: usertype,
    };
    setUserCookie(userProfile as Record<string, unknown>);
  }

  return {
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email || email,
          username: username,
          usertype: usertype,
          confirmed: !!data.user.email_confirmed_at,
          blocked: false,
          provider: "email",
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        }
      : null,
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }
      : null,
    error: null,
  };
}

/**
 * Sign in a user with email and password
 * Replaces: strapiLogin()
 */
export async function signIn({
  email,
  password,
}: SignInOptions): Promise<AuthResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      user: null,
      session: null,
      error: {
        message: error.message,
        status: error.status,
      },
    };
  }

  // Fetch user profile from user_profiles table
  let userProfile: UserProfile | null = null;
  if (data.user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    userProfile = profile || {
      id: data.user.id,
      email: data.user.email || email,
      username: data.user.user_metadata?.username || email.split("@")[0],
      usertype: data.user.user_metadata?.usertype || "student",
      confirmed: !!data.user.email_confirmed_at,
      blocked: false,
      provider: "email",
      created_at: data.user.created_at,
      updated_at: data.user.updated_at || data.user.created_at,
    };

    // Store user info in cookie for compatibility
    if (userProfile) {
      setUserCookie({
        id: userProfile.id,
        documentId: userProfile.id, // For backward compatibility
        email: userProfile.email,
        username: userProfile.username,
        usertype: userProfile.usertype,
      });
    }
  }

  return {
    user: userProfile,
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }
      : null,
    error: null,
  };
}

/**
 * Sign out the current user
 * Replaces: removeAuthToken() + clearAuthCookies()
 */
export async function signOut(): Promise<{
  error: { message: string } | null;
}> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.signOut();

  // Clear all cookies regardless of error
  clearAuthCookies();

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Get the current authenticated user
 * Replaces: fetchMe()
 */
export async function getCurrentUser(): Promise<{
  user: UserProfile | null;
  error: { message: string } | null;
}> {
  const supabase = getSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: error ? { message: error.message } : null,
    };
  }

  // Fetch full user profile
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    // Return basic user info if profile doesn't exist
    return {
      user: {
        id: user.id,
        email: user.email || "",
        username:
          user.user_metadata?.username || user.email?.split("@")[0] || "",
        usertype: user.user_metadata?.usertype || "student",
        confirmed: !!user.email_confirmed_at,
        blocked: false,
        provider: user.app_metadata?.provider || "email",
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      },
      error: null,
    };
  }

  return {
    user: profile,
    error: null,
  };
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabaseClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return {
    session,
    error: error ? { message: error.message } : null,
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getSession();
  return !!session;
}

/**
 * Get access token for API calls (if needed for backward compatibility)
 * Note: Supabase client handles auth automatically, so you rarely need this
 */
export async function getAccessToken(): Promise<string | null> {
  const { session } = await getSession();
  return session?.access_token || null;
}

/**
 * Refresh the session if expired
 */
export async function refreshSession() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.refreshSession();

  return {
    session: data.session,
    error: error ? { message: error.message } : null,
  };
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string,
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Update user password
 */
export async function updatePassword(
  newPassword: string,
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Update user email
 */
export async function updateEmail(
  newEmail: string,
): Promise<{ error: { message: string } | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void,
) {
  const supabase = getSupabaseClient();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (
      event: string,
      session: {
        user?: {
          id: string;
          email?: string;
          user_metadata?: { username?: string; usertype?: string };
        };
      } | null,
    ) => {
      callback(event, session);

      // Sync user cookie on auth changes
      if (event === "SIGNED_IN" && session?.user) {
        setUserCookie({
          id: session.user.id,
          documentId: session.user.id,
          email: session.user.email,
          username:
            session.user.user_metadata?.username ||
            session.user.email?.split("@")[0],
          usertype: session.user.user_metadata?.usertype,
        });
      } else if (event === "SIGNED_OUT") {
        clearAuthCookies();
      }
    },
  );

  return subscription;
}
