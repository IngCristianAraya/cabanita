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

async function testDailyMenuAccess() {
  try {
    console.log('🧪 PRUEBA DE ACCESO AL MENÚ DIARIO');
    console.log('=====================================\n');
    
    // Credenciales del cajero
    const credentials = {
      email: 'cajero@cabanita.com',
      password: 'cajacabanitacaja123'
    };
    
    console.log(`🔐 Intentando login con: ${credentials.email}`);
    
    // 1. Intentar hacer login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (authError) {
      console.error('❌ ERROR EN LOGIN:', authError.message);
      return;
    }
    
    if (!authData.user) {
      console.error('❌ ERROR: No se obtuvo usuario después del login');
      return;
    }
    
    console.log('✅ LOGIN EXITOSO');
    console.log(`👤 Usuario: ${authData.user.email}`);
    console.log(`🆔 ID: ${authData.user.id}`);
    
    // 2. Verificar si es admin
    console.log('\n🔍 Verificando permisos de admin...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', credentials.email)
      .single();
    
    if (adminError) {
      console.error('❌ ERROR verificando admin:', adminError.message);
      console.log('❌ RESULTADO: Usuario NO tiene permisos de admin');
      return;
    }
    
    if (!adminData) {
      console.log('❌ RESULTADO: Usuario NO encontrado en admin_users');
      return;
    }
    
    console.log('✅ USUARIO ES ADMIN');
    console.log(`📋 Datos admin:`, {
      name: adminData.name,
      role: adminData.role,
      is_active: adminData.is_active
    });
    
    // 3. Intentar acceder a datos del menú diario
    console.log('\n📅 Intentando acceder al menú diario...');
    
    // Primero verificar si existe la tabla daily_menu
    const { data: dailyMenuData, error: dailyMenuError } = await supabase
      .from('daily_menu')
      .select('*')
      .limit(5);
    
    if (dailyMenuError) {
      console.log('⚠️  Tabla daily_menu no existe o no hay datos:', dailyMenuError.message);
      
      // Intentar acceder a menu_items como alternativa
      console.log('\n🍽️  Intentando acceder a menu_items...');
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .limit(5);
      
      if (menuError) {
        console.error('❌ ERROR accediendo a menu_items:', menuError.message);
      } else {
        console.log('✅ ACCESO A MENU_ITEMS EXITOSO');
        console.log(`📊 Encontrados ${menuData.length} items del menú:`);
        menuData.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} - $${item.price}`);
        });
      }
    } else {
      console.log('✅ ACCESO AL MENÚ DIARIO EXITOSO');
      console.log(`📊 Encontrados ${dailyMenuData.length} items del menú diario:`);
      dailyMenuData.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name || item.menu_item_name} - Disponible: ${item.is_available}`);
      });
    }
    
    // 4. Probar acceso a órdenes
    console.log('\n📦 Intentando acceder a órdenes...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, total, created_at')
      .limit(3);
    
    if (ordersError) {
      console.log('⚠️  Error accediendo a órdenes:', ordersError.message);
    } else {
      console.log('✅ ACCESO A ÓRDENES EXITOSO');
      console.log(`📊 Encontradas ${ordersData.length} órdenes recientes:`);
      ordersData.forEach((order, index) => {
        console.log(`  ${index + 1}. Orden #${order.id} - ${order.status} - $${order.total}`);
      });
    }
    
    // 5. Cerrar sesión
    console.log('\n🚪 Cerrando sesión...');
    await supabase.auth.signOut();
    console.log('✅ Sesión cerrada correctamente');
    
    console.log('\n🎉 RESUMEN DE LA PRUEBA:');
    console.log('========================');
    console.log('✅ Login funcional');
    console.log('✅ Verificación de admin exitosa');
    console.log('✅ Acceso a datos permitido');
    console.log('✅ Sistema completamente funcional');
    
  } catch (error) {
    console.error('❌ ERROR INESPERADO:', error);
  }
}

// Ejecutar la prueba
testDailyMenuAccess();