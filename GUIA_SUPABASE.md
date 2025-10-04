# Guía Completa: Configuración de Supabase para Cabañita

## 📋 Índice
1. [Crear cuenta en Supabase](#1-crear-cuenta-en-supabase)
2. [Crear nuevo proyecto](#2-crear-nuevo-proyecto)
3. [Configurar la base de datos](#3-configurar-la-base-de-datos)
4. [Obtener credenciales](#4-obtener-credenciales)
5. [Configurar variables de entorno](#5-configurar-variables-de-entorno)
6. [Configurar autenticación](#6-configurar-autenticación)
7. [Verificar conexión](#7-verificar-conexión)

---

## 1. Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign Up"**
3. Puedes registrarte con:
   - GitHub (recomendado)
   - Google
   - Email y contraseña

---

## 2. Crear nuevo proyecto

1. Una vez logueado, haz clic en **"New Project"**
2. Completa los datos:
   - **Name**: `cabanita-restaurant` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡guárdala!)
   - **Region**: Selecciona la más cercana a tu ubicación
   - **Pricing Plan**: Selecciona "Free" para empezar

3. Haz clic en **"Create new project"**
4. Espera 2-3 minutos mientras se crea el proyecto

---

## 3. Configurar la base de datos

### 3.1 Ejecutar migraciones existentes

Tu proyecto ya tiene las migraciones preparadas. Ve al **SQL Editor** en Supabase:

1. En el panel izquierdo, haz clic en **"SQL Editor"**
2. Copia y pega el contenido de cada archivo de migración:

#### Migración 1: Schema principal
Ve al **SQL Editor** y ejecuta este comando:

```sql
-- Copia y pega TODO el contenido del archivo:
-- supabase/migrations/20251003060615_create_restaurant_schema.sql
-- 
-- El archivo contiene 410 líneas que crean todas las tablas necesarias:
-- - restaurants, categories, menu_items, daily_menus
-- - orders, order_items, customers
-- - Y todas las relaciones y políticas de seguridad
```

#### Migración 2: Ventas locales
```sql
-- Copia y pega TODO el contenido del archivo:
-- supabase/migrations/20241201000000_add_local_sales_table.sql

CREATE TABLE IF NOT EXISTS local_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_orders INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

CREATE INDEX IF NOT EXISTS idx_local_sales_date ON local_sales(date);
ALTER TABLE local_sales ENABLE ROW LEVEL SECURITY;

-- (Continúa con el resto del archivo...)
```

3. Ejecuta cada migración haciendo clic en **"Run"**

### 3.2 Verificar tablas creadas

Ve a **"Table Editor"** y verifica que se crearon las siguientes tablas:
- `menu_items`
- `orders`
- `order_items`
- `local_sales`

---

## 4. Obtener credenciales

### 4.1 URL del proyecto
1. Ve a **"Settings"** → **"API"**
2. Copia la **"Project URL"**
   - Ejemplo: `https://abcdefghijklmnop.supabase.co`

### 4.2 Clave anónima (anon key)
1. En la misma página, busca **"Project API keys"**
2. Copia la clave **"anon public"**
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4.3 Clave de servicio (opcional)
- Para operaciones administrativas, también puedes copiar la **"service_role"** key
- ⚠️ **NUNCA** expongas esta clave en el frontend

---

## 5. Configurar variables de entorno

### 5.1 Crear archivo .env.local
En la raíz de tu proyecto, crea o edita el archivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui

# WhatsApp Configuration (opcional)
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_API_TOKEN=tu-token-de-whatsapp
RESTAURANT_WHATSAPP=+1234567890
```

### 5.2 Reemplazar valores
- Reemplaza `https://tu-proyecto-id.supabase.co` con tu URL real
- Reemplaza `tu-clave-anonima-aqui` con tu clave anónima real

---

## 6. Configurar autenticación

### 6.1 Habilitar proveedores de autenticación
1. Ve a **"Authentication"** → **"Providers"**
2. Habilita los proveedores que necesites:
   - **Email**: Ya está habilitado por defecto
   - **Google**: Si quieres login con Google
   - **GitHub**: Si quieres login con GitHub

### 6.2 Configurar políticas de seguridad (RLS)
1. Ve a **"Authentication"** → **"Policies"**
2. Para cada tabla, puedes crear políticas de seguridad
3. Para empezar, puedes desactivar RLS temporalmente:

```sql
-- Ejecuta en SQL Editor para desactivar RLS temporalmente
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE local_sales DISABLE ROW LEVEL SECURITY;
```

⚠️ **Importante**: En producción, siempre activa y configura RLS correctamente.

---

## 7. Verificar conexión

### 7.1 Reiniciar el servidor de desarrollo
```bash
# Detén el servidor actual (Ctrl+C)
# Luego reinicia:
npm run dev
```

### 7.2 Probar la aplicación
1. Ve a `http://localhost:3001/admin/login`
2. Crea una cuenta de prueba
3. Verifica que puedas acceder al dashboard

### 7.3 Verificar datos en Supabase
1. Ve a **"Table Editor"** en Supabase
2. Revisa que los datos se estén guardando correctamente

---

## 🔧 Solución de problemas comunes

### Error: "Invalid supabaseUrl"
- Verifica que la URL tenga el formato correcto: `https://proyecto.supabase.co`
- No incluyas `/` al final de la URL

### Error: "Invalid API key"
- Verifica que copiaste la clave completa
- Usa la clave "anon public", no la "service_role" para el frontend

### Error: "Failed to fetch"
- Verifica tu conexión a internet
- Confirma que el proyecto de Supabase esté activo

### Tablas no aparecen
- Verifica que ejecutaste las migraciones correctamente
- Revisa el SQL Editor por errores

---

## 📚 Recursos adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Configuración de autenticación](https://supabase.com/docs/guides/auth)

---

## 🎯 Próximos pasos

Una vez configurado Supabase:

1. **Poblar datos de prueba**: Agrega algunos elementos del menú
2. **Configurar WhatsApp**: Si planeas usar la integración
3. **Configurar RLS**: Para seguridad en producción
4. **Backup**: Configura respaldos automáticos
5. **Monitoreo**: Revisa métricas y logs regularmente

---

¿Necesitas ayuda con algún paso específico? ¡No dudes en preguntar!