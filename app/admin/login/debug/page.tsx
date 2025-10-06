'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function DebugLoginPage() {
  const [email, setEmail] = useState('admin_delivery@cabanita.com')
  const [password, setPassword] = useState('cabanitaadmincabanita123')
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testEnvironmentVariables = () => {
    addLog('🔍 VERIFICANDO VARIABLES DE ENTORNO:')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    addLog(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ NO configurada'}`)
    addLog(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Configurada' : '❌ NO configurada'}`)
    
    if (!supabaseUrl || !supabaseKey) {
      addLog('❌ ERROR: Variables de entorno faltantes')
      return false
    }
    
    return { supabaseUrl, supabaseKey }
  }

  const testLogin = async () => {
    setIsLoading(true)
    setLogs([])
    
    try {
      addLog('🚀 INICIANDO PRUEBA DE LOGIN DEBUG')
      
      // 1. Verificar variables de entorno
      const envVars = testEnvironmentVariables()
      if (!envVars) {
        setIsLoading(false)
        return
      }
      
      // 2. Crear cliente Supabase
      addLog('🔧 Creando cliente Supabase...')
      const supabase = createClient(envVars.supabaseUrl, envVars.supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      })
      
      // 3. Probar conexión
      addLog('🔗 Probando conexión a Supabase...')
      const { data: testData, error: testError } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1)
      
      if (testError) {
        addLog(`❌ Error de conexión: ${testError.message}`)
        setIsLoading(false)
        return
      }
      
      addLog('✅ Conexión exitosa')
      
      // 4. Intentar login
      addLog(`🔐 Intentando login con: ${email}`)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) {
        addLog(`❌ Error de autenticación: ${authError.message}`)
        setIsLoading(false)
        return
      }
      
      if (!authData.user) {
        addLog('❌ No se obtuvo usuario después del login')
        setIsLoading(false)
        return
      }
      
      addLog('✅ Login exitoso!')
      addLog(`👤 Usuario: ${authData.user.email}`)
      addLog(`🆔 ID: ${authData.user.id}`)
      
      // 5. Verificar admin
      addLog('🔍 Verificando permisos de admin...')
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (adminError || !adminData) {
        addLog(`❌ Error verificando admin: ${adminError?.message || 'Usuario no encontrado'}`)
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }
      
      addLog('✅ Usuario verificado como admin')
      addLog(`📋 Rol: ${adminData.role}`)
      addLog(`🟢 Estado: ${adminData.is_active ? 'Activo' : 'Inactivo'}`)
      
      // 6. Probar redirección
      addLog('🔄 Probando redirección...')
      
      // Simular redirección
      setTimeout(() => {
        addLog('✅ TODO FUNCIONA CORRECTAMENTE!')
        addLog('🎯 El problema puede estar en:')
        addLog('   1. Cache del navegador')
        addLog('   2. Extensiones del navegador')
        addLog('   3. JavaScript deshabilitado')
        addLog('   4. Cookies bloqueadas')
        
        // Redirigir después de mostrar los logs
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      }, 1000)
      
    } catch (error: any) {
      addLog(`❌ Error inesperado: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔍 DEBUG LOGIN - Diagnóstico Completo
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de prueba */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Credenciales de Prueba</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              
              <button
                onClick={testLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '🔄 Probando...' : '🧪 Probar Login'}
              </button>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="font-medium text-yellow-800 mb-2">💡 Instrucciones:</h3>
                <ol className="text-sm text-yellow-700 space-y-1">
                  <li>1. Abre las herramientas de desarrollador (F12)</li>
                  <li>2. Ve a la pestaña "Console"</li>
                  <li>3. Haz clic en "Probar Login"</li>
                  <li>4. Observa los logs en tiempo real</li>
                </ol>
              </div>
            </div>
            
            {/* Logs en tiempo real */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Logs de Diagnóstico</h2>
              
              <div className="bg-black text-green-400 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">Haz clic en "Probar Login" para comenzar...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">🎯 URL de Acceso:</h3>
            <p className="text-blue-700">
              <strong>Debug:</strong> http://localhost:3000/admin/login/debug
            </p>
            <p className="text-blue-700">
              <strong>Login Normal:</strong> http://localhost:3000/admin/login
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}