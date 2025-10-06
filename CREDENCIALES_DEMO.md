# 🔐 CREDENCIALES PARA DEMOSTRACIÓN

## Credenciales de Acceso Admin

### 👨‍💼 Administrador Principal
- **Email:** `admin_delivery@cabanita.com`
- **Password:** `cabanitaadmincabanita123`
- **Rol:** Administrador completo
- **Permisos:** Acceso total al sistema

### 👩‍💼 Manager
- **Email:** `manager@cabanita.com`
- **Password:** `managercabanitamanager123`
- **Rol:** Manager
- **Permisos:** Gestión de órdenes y reportes

### 👨‍💻 Cajero
- **Email:** `cajero@cabanita.com`
- **Password:** `cajacabanitacaja123`
- **Rol:** Cajero
- **Permisos:** Ventas locales y órdenes

## 🚀 URLs de Acceso

- **Login Admin:** `http://localhost:3000/admin/login`
- **Dashboard:** `http://localhost:3000/admin`
- **Gestión de Menú:** `http://localhost:3000/admin/menu`
- **Órdenes:** `http://localhost:3000/admin/orders`
- **Cocina:** `http://localhost:3000/admin/kitchen`

## 📋 Funcionalidades Disponibles

### ✅ Sistema de Login
- ✅ Autenticación segura con Supabase
- ✅ Verificación de roles de admin
- ✅ Redirección automática después del login
- ✅ Middleware de protección de rutas
- ✅ Manejo de sesiones

### ✅ Dashboard Admin
- ✅ Métricas de ventas en tiempo real
- ✅ Gráficos de ingresos diarios/mensuales
- ✅ Panel de órdenes recientes
- ✅ Formulario de ventas locales
- ✅ Panel de WhatsApp
- ✅ Reportes de negocio

### ✅ Gestión de Órdenes
- ✅ Vista de todas las órdenes
- ✅ Cambio de estado de órdenes
- ✅ Filtros por estado y fecha
- ✅ Detalles completos de cada orden

### ✅ Panel de Cocina
- ✅ Tickets de cocina en tiempo real
- ✅ Gestión de preparación
- ✅ Estados de órdenes

## 🎯 Para la Demostración

1. **Iniciar el servidor:** `npm run dev`
2. **Acceder a:** `http://localhost:3000/admin/login`
3. **Usar credenciales:** `admin_delivery@cabanita.com` / `cabanitaadmincabanita123`
4. **Mostrar funcionalidades del dashboard**
5. **Navegar por las diferentes secciones**

## 🔒 Seguridad

- Las credenciales están hasheadas en la base de datos
- Autenticación JWT con Supabase
- Middleware de protección en todas las rutas admin
- Row Level Security (RLS) activado
- Variables de entorno protegidas

---
**Nota:** Estas credenciales son solo para demostración. En producción se deben cambiar por credenciales más seguras.