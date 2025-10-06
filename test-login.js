const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Configuración:');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? 'Configurada' : 'NO CONFIGURADA');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('\n🔍 Probando conexión con Supabase...');
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, full_name, role')
      .limit(5);

    if (error) {
      console.error('❌ Error conectando:', error);
      return;
    }

    console.log('✅ Conexión exitosa!');
    console.log('📋 Usuarios admin encontrados:');
    data.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    // Probar autenticación con un email simple
    console.log('\n🔐 Probando autenticación...');
    
    const testCredentials = [
      { email: 'admin@test.com', password: 'admin123456' },
      { email: 'admin_delivery@cabanita.com', password: 'admin123456' },
      { email: 'test@example.com', password: 'test123456' }
    ];

    for (const cred of testCredentials) {
      console.log(`\n🧪 Probando: ${cred.email}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });

      if (authError) {
        console.log(`❌ Error: ${authError.message}`);
      } else {
        console.log(`✅ Login exitoso para: ${cred.email}`);
        console.log(`👤 Usuario ID: ${authData.user?.id}`);
        
        // Cerrar sesión
        await supabase.auth.signOut();
      }
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

testConnection();