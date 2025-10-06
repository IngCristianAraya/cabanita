const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 DIAGNÓSTICO COMPLETO DEL PROBLEMA DE LOGIN');
console.log('==============================================\n');

// 1. Verificar variables de entorno
console.log('📋 1. VERIFICANDO VARIABLES DE ENTORNO:');
console.log('---------------------------------------');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ NO configurada');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ NO configurada');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ ERROR CRÍTICO: Variables de entorno faltantes');
  console.log('\n🔧 SOLUCIÓN:');
  console.log('1. Verifica que el archivo .env.local existe');
  console.log('2. Verifica que contiene:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

async function debugLoginIssue() {
  try {
    console.log('\n📋 2. PROBANDO CONEXIÓN A SUPABASE:');
    console.log('-----------------------------------');
    
    // Probar conexión básica
    const { data: testData, error: testError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión a Supabase:', testError.message);
      console.log('\n🔧 POSIBLES CAUSAS:');
      console.log('1. URL de Supabase incorrecta');
      console.log('2. Clave anónima incorrecta');
      console.log('3. Tabla admin_users no existe');
      console.log('4. Políticas RLS muy restrictivas');
      return;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    
    console.log('\n📋 3. VERIFICANDO TABLA ADMIN_USERS:');
    console.log('------------------------------------');
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('email, role, is_active')
      .limit(5);
    
    if (adminError) {
      console.error('❌ Error accediendo a admin_users:', adminError.message);
      return;
    }
    
    console.log(`✅ Usuarios admin encontrados: ${adminUsers.length}`);
    adminUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} - ${user.role} - ${user.is_active ? 'Activo' : 'Inactivo'}`);
    });
    
    console.log('\n📋 4. PROBANDO LOGIN CON CREDENCIALES ADMIN:');
    console.log('---------------------------------------------');
    
    const testCredentials = [
      { email: 'admin_delivery@cabanita.com', password: 'cabanitaadmincabanita123' },
      { email: 'manager@cabanita.com', password: 'cabanitaadmincabanita123' },
      { email: 'cajero@cabanita.com', password: 'cajacabanitacaja123' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`\n🔐 Probando: ${cred.email}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });
      
      if (authError) {
        console.log(`❌ Error de login: ${authError.message}`);
        continue;
      }
      
      if (!authData.user) {
        console.log('❌ No se obtuvo usuario después del login');
        continue;
      }
      
      console.log('✅ Login exitoso');
      console.log(`👤 Usuario: ${authData.user.email}`);
      
      // Verificar admin
      const { data: adminData, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', cred.email)
        .single();
      
      if (adminCheckError || !adminData) {
        console.log('❌ Usuario no es admin o error en verificación');
      } else {
        console.log('✅ Usuario verificado como admin');
        console.log(`📋 Rol: ${adminData.role}`);
      }
      
      // Cerrar sesión para la siguiente prueba
      await supabase.auth.signOut();
      console.log('🚪 Sesión cerrada');
    }
    
    console.log('\n📋 5. VERIFICANDO CONFIGURACIÓN DEL NAVEGADOR:');
    console.log('-----------------------------------------------');
    console.log('⚠️  IMPORTANTE: Verifica en el navegador:');
    console.log('1. Abre las herramientas de desarrollador (F12)');
    console.log('2. Ve a la pestaña "Console"');
    console.log('3. Recarga la página de login');
    console.log('4. Busca errores en rojo');
    console.log('5. Ve a la pestaña "Network" y verifica las peticiones');
    
    console.log('\n📋 6. PASOS PARA SOLUCIONAR:');
    console.log('----------------------------');
    console.log('Si el login no funciona en el navegador:');
    console.log('1. Limpia el cache del navegador (Ctrl+Shift+R)');
    console.log('2. Abre una ventana de incógnito');
    console.log('3. Verifica que no hay extensiones bloqueando JavaScript');
    console.log('4. Verifica que las variables de entorno están cargadas');
    console.log('5. Reinicia el servidor de desarrollo');
    
    console.log('\n🎯 CREDENCIALES PARA PROBAR EN EL NAVEGADOR:');
    console.log('=============================================');
    console.log('Email: admin_delivery@cabanita.com');
    console.log('Password: cabanitaadmincabanita123');
    console.log('URL: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ ERROR INESPERADO:', error);
  }
}

debugLoginIssue();