import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  last_login?: string;
}

export interface Session {
  user: User;
  access_token: string;
}

// Get current session from Supabase
export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Get user details from admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      // User exists in auth but not in admin_users or is inactive
      await supabase.auth.signOut();
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
        last_login: adminUser.last_login,
      },
      access_token: session.access_token,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Require authentication - redirect to login if not authenticated
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  return session;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    console.log('Attempting to sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }

    console.log('Supabase auth successful, checking admin_users table...');

    // Verificar que el usuario existe en admin_users y está activo
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      console.error('Admin user validation failed:', adminError);
      // Sign out if user is not in admin_users
      await supabase.auth.signOut();
      throw new Error('Usuario no autorizado para acceso administrativo');
    }

    console.log('Admin user validated:', adminUser.email, adminUser.role);

    // Update last_login in admin_users table
    if (data.user) {
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', data.user.email);
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Sign up new admin user (only if email exists in admin_users table)
export async function signUp(email: string, password: string) {
  try {
    // First check if email exists in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('email, is_active')
      .eq('email', email)
      .single();

    if (adminError || !adminUser || !adminUser.is_active) {
      throw new Error('Email no autorizado para acceso administrativo');
    }

    // If email is authorized, proceed with signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Check if user has specific role
export function hasRole(session: Session | null, requiredRole: string): boolean {
  if (!session) return false;
  
  const roleHierarchy = {
    'admin': ['admin', 'manager', 'cashier'],
    'manager': ['manager', 'cashier'],
    'cashier': ['cashier']
  };
  
  const userRole = session.user.role;
  return roleHierarchy[userRole as keyof typeof roleHierarchy]?.includes(requiredRole) || false;
}
