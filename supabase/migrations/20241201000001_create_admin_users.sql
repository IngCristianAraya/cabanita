-- Solo insertar usuarios en admin_users (sin crear tabla ni políticas)
-- Ejecutar este SQL en el SQL Editor de Supabase

-- Verificar usuarios existentes
SELECT * FROM admin_users;

-- Limpiar usuarios anteriores si es necesario
DELETE FROM admin_users WHERE email IN ('admin@cabanita.com', 'manager@cabanita.com');

-- Insertar los 3 usuarios con roles completos
INSERT INTO admin_users (email, full_name, role, is_active) 
VALUES 
  ('admin_delivery@cabanita.com', 'Administrador Principal', 'admin', true),
  ('manager@cabanita.com', 'Gerente', 'manager', true),
  ('cajero@cabanita.com', 'Cajero Principal', 'cashier', true)
ON CONFLICT (email) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT email, full_name, role, is_active FROM admin_users ORDER BY role;