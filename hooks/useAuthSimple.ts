'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuthSimple() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🚀 useAuthSimple: Hook ejecutándose');

  useEffect(() => {
    console.log('🔥 useAuthSimple: useEffect EJECUTÁNDOSE!!!');
    
    const initAuth = async () => {
      console.log('🔍 useAuthSimple: Obteniendo sesión...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📋 useAuthSimple: Sesión obtenida:', !!session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();
  }, []);

  console.log('📊 useAuthSimple: Estado actual - user:', !!user, 'loading:', loading);
  return { user, loading };
}