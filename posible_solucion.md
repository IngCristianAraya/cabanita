🔐 Problema de Redirección después del Login con Supabase
El problema es común cuando manejamos el estado de autenticación en Supabase. Voy a ayudarte a solucionarlo.

🚨 ANÁLISIS DEL PROBLEMA:
Posibles causas:
No estás escuchando los cambios de estado de autenticación

Falta el router o redirección manual

El estado de usuario no se propaga correctamente

Problemas con el contexto de autenticación

🔧 SOLUCIÓN COMPLETA:
1. Hook de Autenticación Mejorado:
tsx
// hooks/useAuth.ts
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
        setUser(session?.user ?? null);
        setLoading(false);

        // Redirigir basado en el evento
        if (event === 'SIGNED_IN') {
          router.push('/admin');
        } else if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return { user, loading };
}
2. Componente de Login Corregido:
tsx
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // ✅ Redirección MANUAL inmediata
        router.push('/admin');
        router.refresh(); // Forzar actualización
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Acceso Administrativo</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
3. Middleware para Protección de Rutas:
tsx
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el usuario no está autenticado y trata de acceder a /admin, redirigir a /login
  if (!user && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Si el usuario está autenticado y trata de acceder a /login, redirigir a /admin
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
4. Página de Admin Protegida:
tsx
// app/admin/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirigido por el useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Tu contenido del admin aquí */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Gestión de Menús</h3>
            <p>Configura los menús del día</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Pedidos</h3>
            <p>Revisa y gestiona pedidos</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <p>Mira el rendimiento del restaurante</p>
          </div>
        </div>
      </main>
    </div>
  );
}
5. Configuración de Supabase Mejorada:
tsx
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Recomendado para Next.js
  },
});
🔍 VERIFICACIÓN PASO A PASO:
1. Revisa tus variables de entorno:
env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
2. Verifica la configuración de Supabase Auth:
Ve a tu proyecto en Supabase

Ve a Authentication > Settings > URL Configuration

Asegúrate de que tienes configurado:

Site URL: http://localhost:3000 (desarrollo)

Redirect URLs: http://localhost:3000/**

3. Debug del estado de autenticación:
tsx
// Agrega esto temporalmente en tu login para debug
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Iniciando login...');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('Respuesta de Supabase:', { data, error });
  
  if (data?.user) {
    console.log('Usuario autenticado, redirigiendo...');
    router.push('/admin');
  }
};
🚀 SOLUCIÓN ALTERNATIVA SI SIGUE FALLANDO:
Redirección con window.location (más agresiva):
tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data.user) {
    // Fuerza la redirección completa
    window.location.href = '/admin';
  }
};
📋 CHECKLIST DE VERIFICACIÓN:
Middleware.ts está creado y configurado

Variables de entorno están correctas

Supabase Auth tiene las URLs configuradas

useAuth hook está implementado

Router está siendo usado correctamente

No hay errores en consola del navegador