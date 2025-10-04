-- Insertar usuarios administradores iniciales
-- Nota: Estos usuarios necesitarán ser creados también en Supabase Auth manualmente

-- Insertar usuario administrador principal
INSERT INTO admin_users (id, email, full_name, role, active) 
VALUES (
  gen_random_uuid(),
  'admin@cabañita.com',
  'Administrador Principal',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insertar usuario gerente
INSERT INTO admin_users (id, email, full_name, role, active) 
VALUES (
  gen_random_uuid(),
  'manager@cabañita.com',
  'Gerente',
  'admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Mostrar los usuarios creados
SELECT 
  id,
  email,
  full_name,
  role,
  active,
  created_at
FROM admin_users 
WHERE email IN ('admin@cabañita.com', 'manager@cabañita.com');