-- Limpiar usuarios duplicados y verificar estado actual
-- Ejecutar este SQL en el SQL Editor de Supabase

-- 1. Ver todos los usuarios en auth.users
SELECT 'USUARIOS EN AUTH.USERS:' as info;
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email LIKE '%cabanita.com' 
ORDER BY email, created_at;

-- 2. Ver todos los usuarios en admin_users
SELECT 'USUARIOS EN ADMIN_USERS:' as info;
SELECT email, full_name, role, is_active, created_at 
FROM admin_users 
ORDER BY email;

-- 3. Limpiar duplicados en auth.users (mantener solo el más reciente de cada email)
WITH duplicates AS (
  SELECT id, email, 
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
  FROM auth.users 
  WHERE email IN ('admin_delivery@cabanita.com', 'manager@cabanita.com', 'cajero@cabanita.com')
)
DELETE FROM auth.users 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 4. Verificar que solo queda 1 usuario por email en auth.users
SELECT 'DESPUÉS DE LIMPIAR AUTH.USERS:' as info;
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email LIKE '%cabanita.com' 
ORDER BY email;

-- 5. Verificar admin_users (debería tener solo 3 usuarios)
SELECT 'VERIFICAR ADMIN_USERS FINAL:' as info;
SELECT email, full_name, role, is_active 
FROM admin_users 
ORDER BY role;