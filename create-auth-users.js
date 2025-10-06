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

async function createAuthUser(email, password, fullName) {
  try {
    console.log(`🔄 Creando usuario de autenticación: ${email}`);
    
    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        full_name: fullName
      }
    });

    if (error) {
      console.error(`❌ Error creando usuario ${email}:`, error.message);
      return false;
    }

    console.log(`✅ Usuario creado exitosamente: ${email}`);
    console.log(`   ID: ${data.user.id}`);
    return true;

  } catch (error) {
    console.error(`❌ Error inesperado con ${email}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🚀 Creando usuarios de autenticación para admins...\n');

    // Obtener usuarios admin existentes
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('email, full_name, role');

    if (error) {
      console.error('❌ Error obteniendo usuarios admin:', error);
      return;
    }

    console.log('📋 Usuarios admin encontrados:');
    adminUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    console.log('\n🔐 Creando credenciales de autenticación...');

    // Crear usuarios de autenticación para cada admin
    const defaultPassword = 'admin123456';
    
    for (const adminUser of adminUsers) {
      await createAuthUser(adminUser.email, defaultPassword, adminUser.full_name);
      console.log('');
    }

    console.log('🎉 Proceso completado!');
    console.log('\n📋 Credenciales de acceso (password para todos: admin123456):');
    adminUsers.forEach(user => {
      console.log(`   ${user.email} / admin123456`);
    });
    console.log('\n🔗 Accede al panel: http://localhost:3001/admin/login');

  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

main();