-- Actualizar contraseñas con unas más seguras
-- Ejecutar este SQL en el SQL Editor de Supabase

-- Actualizar contraseña para admin_delivery@cabanita.com
UPDATE auth.users 
SET encrypted_password = crypt('CabAdmin2024!@#', gen_salt('bf'))
WHERE email = 'admin_delivery@cabanita.com';

-- Actualizar contraseña para manager@cabanita.com  
UPDATE auth.users 
SET encrypted_password = crypt('CabManager2024$%^', gen_salt('bf'))
WHERE email = 'manager@cabanita.com';

-- Actualizar contraseña para cajero@cabanita.com
UPDATE auth.users 
SET encrypted_password = crypt('CabCashier2024&*(', gen_salt('bf'))
WHERE email = 'cajero@cabanita.com';

-- Verificar que las contraseñas se actualizaron
SELECT email, 
       CASE 
         WHEN encrypted_password IS NOT NULL THEN 'Contraseña actualizada'
         ELSE 'Sin contraseña'
       END as password_status,
       updated_at
FROM auth.users 
WHERE email IN ('admin_delivery@cabanita.com', 'manager@cabanita.com', 'cajero@cabanita.com')
ORDER BY email;