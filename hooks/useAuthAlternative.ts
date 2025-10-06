'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

export function useAuthAlternative() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false
  })

  const initialize = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const newState = {
        user: session?.user || null,
        loading: false,
        initialized: true
      }
      
      setState(newState)
      return newState
    } catch (error) {
      console.error('❌ useAuthAlternative: Error obteniendo sesión:', error)
      const errorState = {
        user: null,
        loading: false,
        initialized: true
      }
      setState(errorState)
      return errorState
    }
  }, [])

  // Auto-inicializar cuando el hook se monta
  useEffect(() => {
    if (!state.initialized) {
      initialize()
    }
  }, [initialize, state.initialized])

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('🔐 useAuth: Iniciando signIn con email:', email)
    
    // Evitar múltiples llamadas simultáneas
    if (state.loading) {
      console.log('⚠️ useAuth: SignIn ya en progreso, ignorando llamada duplicada')
      return { error: { message: 'Login en progreso' } }
    }
    
    // Actualizar estado a loading
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📋 useAuth: Respuesta de Supabase signIn:', { data, error })

      if (error) {
        console.error('❌ useAuth: Error en signIn:', error)
        setState(prev => ({ ...prev, loading: false }))
        return { error }
      }

      if (data.user) {
        console.log('👤 useAuth: Usuario autenticado:', data.user.email)
        
        // Verificar si es admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', data.user.email)
          .single()

        console.log('🔍 useAuth: Verificación admin:', { adminData, adminError })

        if (adminError || !adminData) {
          console.error('❌ useAuth: Usuario no es admin:', adminError)
          await supabase.auth.signOut()
          setState(prev => ({ ...prev, loading: false }))
          return { error: { message: 'Usuario no autorizado' } }
        }

        console.log('✅ useAuth: Admin verificado, actualizando estado')
        
        // Esperar un momento para asegurar que la sesión se establezca correctamente
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setState({
          user: data.user,
          loading: false,
          initialized: true
        })

        return { data }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { error: { message: 'No se pudo autenticar' } }
    } catch (error: any) {
      console.error('❌ useAuth: Error inesperado en signIn:', error)
      setState(prev => ({ ...prev, loading: false }))
      return { error }
    }
  }, [state.loading])

  const signOut = useCallback(async () => {
    console.log('🚪 useAuthAlternative: Iniciando signOut')
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ useAuthAlternative: Error en signOut:', error)
        setState(prev => ({ ...prev, loading: false }))
        return { error }
      }

      setState({
        user: null,
        loading: false,
        initialized: true
      })
      
      return { error: null }
    } catch (error) {
      console.error('❌ useAuthAlternative: Error inesperado en signOut:', error)
      setState(prev => ({ ...prev, loading: false }))
      return { error }
    }
  }, []) // Empty dependency array since it doesn't depend on any state

  return {
    user: state.user,
    loading: state.loading,
    initialized: state.initialized,
    initialize,
    signIn,
    signOut,
    supabase // Exponer el cliente de supabase
  }
}