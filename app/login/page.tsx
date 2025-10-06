'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthAlternative } from '@/hooks/useAuthAlternative'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const auth = useAuthAlternative()

  // Estado para prevenir bucles infinitos
  const [redirectAttempted, setRedirectAttempted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Efecto para manejar redirección de usuarios ya autenticados
  const clearSupabaseSession = async () => {
    console.log('🧹 Limpiando sesión de Supabase...')
    await supabase.auth.signOut()
    setRedirectAttempted(false)
    setIsProcessing(false)
    console.log('✅ Sesión limpiada')
  }

  useEffect(() => {
    // Evitar ejecuciones múltiples si ya estamos procesando
    if (isProcessing) {
      console.log('⏸️ useEffect bloqueado - ya está procesando')
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    
    if (errorParam === 'unauthorized') {
      console.log('⚠️ Error de autorización detectado, cerrando sesión')
      auth.signOut()
      return
    }
    
    console.log('🔍 Login page loaded, auth state:', { 
      user: !!auth.user, 
      userEmail: auth.user?.email,
      initialized: auth.initialized,
      loading: auth.loading,
      redirectAttempted,
      isProcessing
    })

    // Solo redirigir si hay una sesión válida Y el usuario está autenticado Y no estamos procesando
    if (auth.initialized && auth.user && !auth.loading && !redirectAttempted && !isProcessing) {
      console.log('✅ Usuario ya autenticado, verificando permisos de admin...')
      console.log('📧 Email del usuario:', auth.user.email)
      console.log('🔄 Estableciendo redirectAttempted = true e isProcessing = true')
      setRedirectAttempted(true)
      setIsProcessing(true)
      
      // Verificar si es admin con un pequeño delay para sincronización
      const checkAdminAndRedirect = async () => {
        try {
          // Esperar un poco para que la sesión se sincronice con el servidor
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', auth.user.email)
            .single();

          if (!adminError && adminData) {
            console.log('✅ Usuario admin verificado, redirigiendo a /admin...')
            console.log('🚀 Ejecutando redirección con window.location.href')
            // Usar window.location.href para forzar la redirección
            setTimeout(() => {
              console.log('🔄 Redirigiendo ahora...')
              window.location.href = '/admin'
            }, 100)
          } else {
            console.log('❌ Usuario no es admin, permaneciendo en login')
            console.log('🔄 Reseteando redirectAttempted = false e isProcessing = false')
            setRedirectAttempted(false) // Resetear si no es admin
            setIsProcessing(false)
          }
        } catch (error) {
          console.error('❌ Error verificando admin:', error)
          console.log('🔄 Reseteando redirectAttempted = false e isProcessing = false por error')
          setRedirectAttempted(false) // Resetear en caso de error
          setIsProcessing(false)
        }
      }

      checkAdminAndRedirect()
    } else if (auth.initialized && !auth.user && !auth.loading) {
      // Si no hay usuario autenticado, asegurar que los flags estén en false
      console.log('ℹ️ No hay usuario autenticado, permitiendo login manual')
      setRedirectAttempted(false)
      setIsProcessing(false)
    } else if (auth.initialized && auth.user && !auth.loading && redirectAttempted && !isProcessing) {
      // Si ya se intentó redirigir pero seguimos aquí, hay un problema de sincronización
      console.log('⚠️ Redirección ya intentada pero seguimos en login - limpiando sesión')
      clearSupabaseSession()
    }
  }, [auth.user, auth.initialized, auth.loading]) // Removemos redirectAttempted e isProcessing de las dependencias

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      console.log('🔐 Iniciando proceso de login...')
      const result = await auth.signIn(email, password)
      
      if (result.error) {
        console.error('❌ Error en login:', result.error.message)
        setError(result.error.message || 'Error de autenticación')
        setIsSubmitting(false)
      } else {
        console.log('✅ Login exitoso!')
        
        // Verificar si es admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();

        if (adminError || !adminData) {
          console.log('❌ Usuario no es admin:', adminError);
          setError('No tienes permisos de administrador');
          return;
        }

        console.log('✅ Verificación de admin exitosa:', adminData);
        
        // ✅ LOGIN EXITOSO - Implementar redirección inteligente
        console.log('🎉 ¡Login exitoso! Iniciando redirección inteligente...');
        
        // Función para verificar si la sesión está sincronizada
        const checkSessionAndRedirect = async (attempt = 1, maxAttempts = 5) => {
          console.log(`🔄 Intento ${attempt}/${maxAttempts} - Verificando sincronización de sesión...`);
          
          try {
            // Verificar sesión actual usando el cliente supabase correcto
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (session && session.user) {
              console.log('✅ Sesión sincronizada correctamente:', session.user.email);
              console.log('🚀 Redirigiendo a /admin...');
              
              // Usar window.location.href para redirección forzada
              setTimeout(() => {
                window.location.href = '/admin';
              }, 100);
              
              return true;
            } else {
              console.log(`⏳ Sesión aún no sincronizada (intento ${attempt})`);
              
              if (attempt < maxAttempts) {
                // Esperar un poco más y reintentar
                setTimeout(() => {
                  checkSessionAndRedirect(attempt + 1, maxAttempts);
                }, 1000); // Esperar 1 segundo entre intentos
              } else {
                console.log('⚠️ Máximo de intentos alcanzado. Mostrando acceso manual.');
                alert('Login exitoso, pero la redirección automática falló. Accede manualmente a: http://localhost:3000/admin');
                setIsSubmitting(false);
              }
              
              return false;
            }
          } catch (error) {
            console.error('❌ Error verificando sesión:', error);
            
            if (attempt < maxAttempts) {
              setTimeout(() => {
                checkSessionAndRedirect(attempt + 1, maxAttempts);
              }, 1000);
            } else {
              alert('Login exitoso, pero hubo un error en la redirección. Accede manualmente a: http://localhost:3000/admin');
              setIsSubmitting(false);
            }
            
            return false;
          }
        };
        
        // Iniciar el proceso de redirección inteligente
        checkSessionAndRedirect();
      }
    } catch (error: any) {
      console.error('❌ Error inesperado:', error)
      setError(error.message || 'Error inesperado')
      setIsSubmitting(false)
    }
  }

  // Mostrar loading mientras se inicializa o se está autenticando
  if (auth.loading || !auth.initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Cargando...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Verificando autenticación
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo_cabañita.png"
              alt="La Cabañita"
              width={120}
              height={120}
              className="h-20 w-auto"
              loading="lazy"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acceso Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        
        <button
          onClick={clearSupabaseSession}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          🧹 Limpiar Sesión (Debug)
        </button>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}