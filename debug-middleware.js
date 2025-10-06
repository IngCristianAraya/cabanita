require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function debugAdminValidation() {
  console.log('🔍 Iniciando debug de validación de admin...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('📊 Variables de entorno:')
  console.log('- SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'NO CONFIGURADA')
  console.log('- SUPABASE_KEY:', supabaseKey ? 'Configurada' : 'NO CONFIGURADA')
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno de Supabase no configuradas')
    return
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Verificar conexión a la base de datos
    console.log('\n🔗 Verificando conexión a Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error de conexión:', testError.message)
      return
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    
    // Listar todos los usuarios admin
    console.log('\n👥 Listando usuarios admin en la base de datos...')
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
    
    if (adminError) {
      console.error('❌ Error al obtener usuarios admin:', adminError.message)
      return
    }
    
    console.log('📋 Usuarios admin encontrados:', adminUsers?.length || 0)
    adminUsers?.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email}, ID: ${user.id}, Activo: ${user.is_active}`)
    })
    
    // Probar autenticación con credenciales específicas
    const testEmail = 'admin@lacabanita.com'
    const testPassword = 'admin123'
    
    console.log(`\n🔐 Probando autenticación con ${testEmail}...`)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    
    if (authError) {
      console.error('❌ Error de autenticación:', authError.message)
      return
    }
    
    console.log('✅ Autenticación exitosa')
    console.log('👤 Usuario autenticado:', authData.user?.email)
    
    // Verificar si el usuario autenticado está en admin_users
    console.log('\n🔍 Verificando si el usuario está en admin_users...')
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', authData.user?.email)
      .single()
    
    if (adminCheckError) {
      console.error('❌ Error al verificar admin:', adminCheckError.message)
      console.log('💡 Esto podría ser la causa del loop de redirección')
    } else {
      console.log('✅ Usuario encontrado en admin_users:', adminCheck)
    }
    
    // Cerrar sesión
    await supabase.auth.signOut()
    console.log('\n🚪 Sesión cerrada')
    
  } catch (error) {
    console.error('💥 Error inesperado:', error.message)
  }
}

// Ejecutar el debug
debugAdminValidation().then(() => {
  console.log('\n🏁 Debug completado')
  process.exit(0)
}).catch(error => {
  console.error('💥 Error fatal:', error.message)
  process.exit(1)
})