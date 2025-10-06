import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API: Refresh endpoint llamado')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ API: Error obteniendo sesión:', error)
      return NextResponse.json({ error: 'Error obteniendo sesión' }, { status: 500 })
    }
    
    if (session) {
      console.log('✅ API: Sesión encontrada, refrescando...')
      
      // Refrescar la sesión
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError) {
        console.error('❌ API: Error refrescando sesión:', refreshError)
        return NextResponse.json({ error: 'Error refrescando sesión' }, { status: 500 })
      }
      
      console.log('✅ API: Sesión refrescada exitosamente')
      return NextResponse.json({ 
        success: true, 
        user: refreshedSession?.user?.email 
      })
    } else {
      console.log('⚠️ API: No hay sesión para refrescar')
      return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 })
    }
  } catch (error) {
    console.error('❌ API: Error inesperado:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}