const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.log('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser(email, password, fullName = 'Administrador') {
  try {
    console.log(`🔄 Creando usuario administrador: ${email}`);

    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirmar el email
      user_metadata: {
        full_name: fullName,
        role: 'admin'
      }
    });

    if (authError) {
      throw authError;
    }

    console.log(`✅ Usuario de autenticación creado: ${authData.user.id}`);

    // 2. Crear el registro en la tabla admin_users
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert([
        {
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: 'admin',
          active: true
        }
      ])
      .select()
      .single();

    if (adminError) {
      throw adminError;
    }

    console.log(`✅ Usuario administrador creado exitosamente:`);
    console.log(`   Email: ${email}`);
    console.log(`   Nombre: ${fullName}`);
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Rol: admin`);
    
    return { user: authData.user, adminUser: adminData };

  } catch (error) {
    console.error(`❌ Error creando usuario ${email}:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando creación de usuarios administradores...\n');

    // Crear usuarios administradores iniciales
    const adminUsers = [
      {
        email: 'admin@cabañita.com',
        password: 'admin123456',
        fullName: 'Administrador Principal'
      },
      {
        email: 'manager@cabañita.com',
        password: 'manager123456',
        fullName: 'Gerente'
      }
    ];

    for (const userData of adminUsers) {
      try {
        await createAdminUser(userData.email, userData.password, userData.fullName);
        console.log('');
      } catch (error) {
        if (error.message.includes('User already registered')) {
          console.log(`⚠️  Usuario ${userData.email} ya existe, saltando...`);
        } else {
          console.error(`❌ Error con ${userData.email}:`, error.message);
        }
        console.log('');
      }
    }

    console.log('🎉 Proceso completado!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('   admin@cabañita.com / admin123456');
    console.log('   manager@cabañita.com / manager123456');
    console.log('\n🔗 Accede al panel: http://localhost:3001/admin/login');

  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

main();