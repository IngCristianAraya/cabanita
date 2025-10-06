const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function testCorrectCredentials() {
  try {
    console.log('🔐 Probando credenciales correctas...\n');
    
    const testCredentials = [
      { email: 'admin_delivery@cabanita.com', password: 'cabanitaadmincabanita123' },
      { email: 'manager@cabanita.com', password: 'managercabanitamanager123' },
      { email: 'cajero@cabanita.com', password: 'cajacabanitacaja123' }
    ];

    for (const cred of testCredentials) {
      console.log(`🧪 Probando: ${cred.email}`);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });

      if (authError) {
        console.log(`❌ Error: ${authError.message}`);
      } else {
        console.log(`✅ Login exitoso para: ${cred.email}`);
        console.log(`👤 Usuario ID: ${authData.user?.id}`);
        console.log(`📧 Email confirmado: ${authData.user?.email_confirmed_at ? 'Sí' : 'No'}`);
        
        // Verificar si es admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', cred.email)
          .single();

        if (adminError) {
          console.log(`❌ Error verificando admin: ${adminError.message}`);
        } else {
          console.log(`👑 Admin verificado: ${adminData.role} - ${adminData.full_name}`);
        }
        
        // Cerrar sesión
        await supabase.auth.signOut();
        console.log('🚪 Sesión cerrada\n');
      }
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

testCorrectCredentials();