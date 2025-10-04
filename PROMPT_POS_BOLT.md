# 🏪 Sistema POS La Cabañita - Prompt para Bolt.new

## 📋 Descripción del Proyecto

Crear un **Sistema de Punto de Venta (POS) completo** para el restaurante "La Cabañita", especializado en comida peruana. El sistema debe manejar tanto pedidos para consumo en el local como pedidos para llevar (delivery), con integración completa de ticketeras, control de mesas y gestión de personal.

## 🎨 Diseño y Temática Visual

**IMPORTANTE**: Mantener la **misma identidad visual** del sitio web existente:
- **Colores principales**: Teal/Aqua (#14B8A6) y tonos complementarios
- **Tipografía**: Moderna y legible, similar al diseño web actual
- **Estilo**: Limpio, profesional, con toques peruanos sutiles
- **Responsive**: Optimizado para tablets (uso principal) y móviles
- **Logo**: Usar el mismo logo de "La Cabañita" del sitio web

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico Requerido:**
- **Frontend**: Next.js 14+ con TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (consistencia con web)
- **Base de datos**: Supabase (compartida con sitio web)
- **Autenticación**: Supabase Auth con roles
- **Estado global**: Zustand
- **Impresión**: react-to-print o similar
- **Tiempo real**: Supabase Realtime

## 🎯 Funcionalidades Core del POS

### **1. 🎫 Sistema de Ticketeras Dual**
- **Ticketera Cocina**: Para pedidos del restaurante (mesas)
- **Ticketera Delivery**: Para pedidos para llevar
- **Formato diferenciado**: Colores/encabezados distintos
- **Auto-impresión**: Al confirmar pedido

### **2. 🪑 Control de Mesas**
- **Numeración de mesas**: 1-20 (configurable)
- **Estados**: Libre, Ocupada, Reservada, Limpieza
- **Tiempo de ocupación**: Cronómetro automático
- **Asignación de mesero**: Por mesa
- **Vista general**: Dashboard con estado de todas las mesas

### **3. 📱 Toma de Pedidos (Tablet/Móvil)**
- **Interfaz para meseros**: Selección de mesa + productos
- **Menú dinámico**: Platos del día (S/13, S/15) + carta fija
- **Observaciones**: Campo libre para especificaciones
- **Modificadores**: Sin cebolla, extra picante, etc.
- **Cantidades**: Selector intuitivo

### **4. 💰 Sistema de Caja**
- **Pedidos para llevar**: Toma directa en caja
- **Cobro de mesas**: Al finalizar consumo
- **Métodos de pago**: Efectivo, Tarjeta, Yape, Plin
- **Facturación SUNAT**: Boleta/Factura electrónica
- **Arqueo de caja**: Apertura/cierre de turno

### **5. 👨‍🍳 Panel de Cocina**
- **Vista de comandas**: En tiempo real
- **Priorización**: Por tiempo de espera
- **Estados**: Pendiente, En preparación, Listo
- **Tiempos estimados**: Por tipo de plato
- **Notificaciones sonoras**: Nuevos pedidos

### **6. 👥 Control de Personal**
- **Registro de entrada/salida**: Sistema de fichaje
- **Roles definidos**: Admin, Cajero, Mesero, Cocina
- **Turnos**: Mañana, Tarde, Noche
- **Reportes de asistencia**: Por empleado/período

## 📊 Panel de Administración

### **Gestión de Menú:**
- **Platos fijos**: Carta permanente
- **Menú del día**: Actualización diaria (S/13, S/15)
- **Control de stock**: Disponibilidad en tiempo real
- **Precios dinámicos**: Ajuste por plato/categoría

### **Reportes y Analytics:**
- **Ventas diarias**: Por turno, mesero, método de pago
- **Platos más vendidos**: Ranking de popularidad
- **Tiempo promedio**: Por mesa, por plato
- **Ingresos**: Gráficos y métricas

### **Configuración:**
- **Datos del restaurante**: RUC, dirección, teléfono
- **Impresoras**: Configuración de ticketeras
- **Mesas**: Numeración y distribución
- **Empleados**: Alta/baja de personal

## 🔄 Flujo de Trabajo

### **Para Consumo en Local:**
1. Cliente llega → Mesero asigna mesa
2. Mesero toma pedido en tablet → Envía a cocina
3. Cocina recibe comanda → Prepara platos
4. Mesero sirve → Cliente consume
5. Cliente va a caja → Paga y se retira

### **Para Llevar/Delivery:**
1. Cliente llega a caja → Solicita pedido
2. Cajero toma pedido → Especifica "PARA LLEVAR"
3. Cocina recibe comanda diferenciada
4. Cliente espera → Paga al recoger

## 🎨 Especificaciones de UI/UX

### **Dashboard Principal:**
- **Vista de mesas**: Grid visual con estados
- **Resumen del día**: Ventas, pedidos activos
- **Accesos rápidos**: Funciones principales

### **Interfaz de Pedidos:**
- **Categorías en tabs**: Como el sitio web actual
- **Cards de productos**: Diseño consistente
- **Carrito lateral**: Resumen del pedido
- **Botones grandes**: Optimizado para touch

### **Panel de Cocina:**
- **Cards de comandas**: Información clara y grande
- **Códigos de color**: Por prioridad/tiempo
- **Botones de estado**: Fácil actualización

## 🔗 Integración Futura

**Preparar para conectar con:**
- Sitio web de delivery existente
- WhatsApp Business API
- Sistema de inventario
- Contabilidad/SUNAT

## 📱 Dispositivos Objetivo

- **Tablets**: 10-12 pulgadas (meseros, cocina)
- **Móviles**: Backup para meseros
- **Desktop**: Administración y caja
- **Impresoras térmicas**: 58mm y 80mm

## 🚀 Entregables Esperados

1. **Sistema POS completo** funcionando
2. **Base de datos** estructurada
3. **Documentación** de uso
4. **Manual de instalación** y configuración
5. **Guía de integración** con sitio web existente

---

**Nota importante**: Este sistema debe ser **robusto, rápido y confiable** ya que será usado en un entorno de producción real con alto volumen de transacciones diarias.

## 🎯 Prioridades de Desarrollo

1. **Alta**: Toma de pedidos, ticketeras, caja
2. **Media**: Control de mesas, panel de cocina
3. **Baja**: Reportes avanzados, control de personal

**¡Crear un POS profesional que revolucione la operación de La Cabañita!** 🇵🇪