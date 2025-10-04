'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, !!session?.user);
        setUser(session?.user ?? null);
        setLoading(false);

        // Redirigir basado en el evento
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in, redirecting to admin...');
          router.push('/admin');
          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ User signed out, redirecting to login...');
          router.push('/admin/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}