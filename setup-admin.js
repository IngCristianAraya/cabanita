require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdminUsers() {
  console.log('🔧 Configurando usuarios admin...');
  
  // Usar los emails que ya existen en la base de datos
  const adminUsers = [
    {
      email: 'admin_delivery@cabanita.com',
      password: 'admin123',
      fullName: 'Administrador Principal'
    },
    {
      email: 'manager@cabanita.com', 
      password: 'manager123',
      fullName: 'Gerente'
    },
    {
      email: 'cajero@cabanita.com',
      password: 'cajero123', 
      fullName: 'Cajero Principal'
    }
  ];

  for (const user of adminUsers) {
    console.log(`\n👤 Procesando usuario: ${user.email}`);
    
    try {
      // Intentar crear usuario en Supabase Auth
      console.log('🔐 Creando usuario en Supabase Auth...');
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists') || authError.message.includes('already been registered')) {
          console.log('ℹ️ Usuario ya existe en Auth, continuando...');
        } else {
          console.error('❌ Error creando usuario en Auth:', authError.message);
          continue;
        }
      } else {
        console.log('✅ Usuario creado en Auth exitosamente');
      }

      // Verificar si ya existe en admin_users
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error verificando admin_users:', checkError.message);
        continue;
      }

      if (existingAdmin) {
        console.log('ℹ️ Usuario ya existe en admin_users');
        
        // Actualizar el registro para asegurar que esté activo
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            is_active: true,
            full_name: user.fullName 
          })
          .eq('email', user.email);

        if (updateError) {
          console.error('❌ Error actualizando admin_users:', updateError.message);
        } else {
          console.log('✅ Usuario actualizado en admin_users');
        }
      } else {
        // Insertar en admin_users si no existe
        console.log('📝 Insertando en tabla admin_users...');
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            email: user.email,
            full_name: user.fullName,
            role: 'admin',
            is_active: true
          });

        if (insertError) {
          console.error('❌ Error insertando en admin_users:', insertError.message);
        } else {
          console.log('✅ Usuario insertado en admin_users exitosamente');
        }
      }

    } catch (error) {
      console.error('❌ Error inesperado:', error.message);
    }
  }

  // Verificar usuarios finales
  console.log('\n📋 Verificando usuarios admin finales...');
  const { data: finalUsers, error: finalError } = await supabase
    .from('admin_users')
    .select('*');

  if (finalError) {
    console.error('❌ Error consultando usuarios finales:', finalError.message);
  } else {
    console.log('✅ Usuarios admin en la base de datos:');
    finalUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.full_name}) - Activo: ${user.is_active}`);
    });
  }

  console.log('\n🎉 Configuración completada');
  console.log('📝 Credenciales de prueba:');
  console.log('  - admin_delivery@cabanita.com / admin123');
  console.log('  - manager@cabanita.com / manager123');
  console.log('  - cajero@cabanita.com / cajero123');
}

setupAdminUsers().catch(console.error);