'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log('🏗️ useAuth: Hook render - user:', !!user, 'loading:', loading);

  useEffect(() => {
    console.log('🔄 useAuth: useEffect EJECUTÁNDOSE!!!');
    let mounted = true;
    
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        console.log('🔍 useAuth: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('⚠️ useAuth: Component unmounted, skipping session update');
          return;
        }
        
        if (error) {
          console.error('❌ useAuth: Error getting session:', error);
        } else {
          console.log('📋 useAuth: Initial session result:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            email: session?.user?.email
          });
        }
        
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('✅ useAuth: Initial session processed, loading set to false');
      } catch (err) {
        console.error('💥 useAuth: Exception in getInitialSession:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    console.log('👂 useAuth: Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 useAuth: Auth state change detected:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          email: session?.user?.email
        });
        
        if (!mounted) {
          console.log('⚠️ useAuth: Component unmounted, skipping auth state update');
          return;
        }
        
        setUser(session?.user ?? null);
        setLoading(false);

        // Redirigir basado en el evento
        if (event === 'SIGNED_IN') {
          console.log('✅ useAuth: User signed in, preparing redirect to admin...');
          setTimeout(() => {
            console.log('🔄 useAuth: Executing redirect to /admin');
            router.replace('/admin');
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ useAuth: User signed out, redirecting to login...');
          router.replace('/login');
        }
      }
    );

    return () => {
      console.log('🧹 useAuth: Cleanup - unmounting...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Removiendo la dependencia del router para ver si eso es el problema

  const signOut = async () => {
    console.log('🚪 useAuth: Signing out...');
    await supabase.auth.signOut();
  };

  console.log('📊 useAuth: Returning state - user:', !!user, 'loading:', loading);
  return { user, loading, signOut };
}