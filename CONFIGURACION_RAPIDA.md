# ⚡ Configuración Rápida de Supabase (5 minutos)

## 🚀 Pasos Rápidos

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) → **Sign Up** (con GitHub es más rápido)
2. **New Project** → Nombre: `cabanita` → Contraseña segura → **Create**
3. Espera 2-3 minutos ⏳

### 2. Configurar base de datos
1. Ve a **SQL Editor** en Supabase
2. Copia y pega **TODO** el contenido de estos archivos (uno por uno):
   - `supabase/migrations/20251003060615_create_restaurant_schema.sql`
   - `supabase/migrations/20241201000000_add_local_sales_table.sql`
3. Haz clic en **Run** para cada uno

### 3. Obtener credenciales
1. Ve a **Settings** → **API**
2. Copia:
   - **Project URL**: `https://abc123.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 4. Configurar variables de entorno
Edita el archivo `.env.local` en tu proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-completa
```

### 5. Reiniciar servidor
```bash
# Ctrl+C para detener
npm run dev
```

### 6. ¡Listo! 🎉
Ve a `http://localhost:3001/admin/login` y crea tu cuenta.

---

## 🔧 Si algo no funciona

### Error "Invalid supabaseUrl"
- ✅ URL debe ser: `https://proyecto.supabase.co` (sin `/` al final)
- ✅ Clave debe ser completa (muy larga, empieza con `eyJ`)

### Tablas no aparecen
- ✅ Ejecutaste ambas migraciones en SQL Editor?
- ✅ Aparecieron errores en rojo? Revisa el SQL

### No puedo hacer login
- ✅ Reiniciaste el servidor después de configurar .env.local?
- ✅ Las credenciales están correctas?

---

## 📞 ¿Necesitas ayuda?
Si tienes problemas, revisa la **GUIA_SUPABASE.md** completa o pregúntame específicamente qué error ves.