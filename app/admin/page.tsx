'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthAlternative } from '@/hooks/useAuthAlternative';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Store,
  Globe,
  Loader2
} from "lucide-react";
import { LocalSalesForm } from "@/components/admin/local-sales-form";
import { WhatsAppPanel } from "@/components/admin/whatsapp-panel";
import { BusinessReports } from "@/components/admin/business-reports";
import { demoData } from "@/lib/demo-data";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/database.types";

// Función para obtener datos del dashboard (modo demo)
async function getDashboardData() {
  // Simulando datos en tiempo real
  const today = new Date().toISOString().split('T')[0];
  
  return {
    todayOnlineRevenue: demoData.analytics.todayRevenue * 0.65, // 65% online
    todayLocalSales: demoData.analytics.todayRevenue * 0.35,   // 35% local
    todayLocalOrders: demoData.localSales[0]?.estimated_orders || 0,
    todayTotalRevenue: demoData.analytics.todayRevenue,
    todayOnlineOrders: Math.floor(demoData.analytics.todayOrders * 0.65), // 65% online
    totalOnlineOrders: demoData.analytics.monthlyOrders,
    monthOnlineRevenue: demoData.analytics.todayRevenue * 20, // Estimado mensual
    monthlyOrders: demoData.analytics.monthlyOrders,
    todayOrders: demoData.analytics.todayOrders,
    averageTicket: demoData.analytics.averageTicket,
    onlinePercentage: demoData.analytics.onlinePercentage
  };
}

async function getRecentOrders() {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data || []) as Order[];
}

export default function AdminDashboard() {
  const auth = useAuthAlternative();
  const router = useRouter();
  const [stats, setStats] = useState({
    todayOnlineRevenue: 0,
    todayLocalSales: 0,
    todayLocalOrders: 0,
    todayTotalRevenue: 0,
    todayOnlineOrders: 0,
    totalOnlineOrders: 0,
    monthOnlineRevenue: 0,
    monthlyOrders: 0,
    todayOrders: 0,
    averageTicket: 0,
    onlinePercentage: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar el hook de autenticación si no está inicializado
    if (!auth.initialized) {
      console.log('🔄 Initializing auth in dashboard...');
      auth.initialize();
      return;
    }

    // Solo cargar datos si hay usuario autenticado
    if (auth.initialized && !auth.loading && auth.user) {
      async function loadData() {
        try {
          console.log('📊 Loading dashboard data...');
          const [dashboardData, ordersData] = await Promise.all([
            getDashboardData(),
          getRecentOrders()
        ]);
        setStats(dashboardData);
        setRecentOrders(ordersData);
        console.log('✅ Dashboard data loaded successfully');
        } catch (error) {
          console.error('❌ Error loading dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
      loadData();
    } else if (auth.initialized && !auth.loading && !auth.user) {
      // Si no hay usuario, simplemente marcar como no loading
      // El middleware ya se encarga de la redirección
      console.log('❌ No user found, middleware will handle redirection');
      setIsLoading(false);
    }
  }, [auth.user, auth.loading, auth.initialized]);

  // ✅ VERIFICACIÓN DEL CLIENTE RESTAURADA CON LÓGICA MEJORADA
  // Solo mostrar loading mientras se inicializa la autenticación
  if (!auth.initialized) {
    console.log('⏳ Esperando inicialización de autenticación...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de la inicialización, el middleware se encargará de la redirección
  if (!auth.user) {
    console.log('⚠️ No hay usuario autenticado - El middleware debería redirigir');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se cargan los datos del dashboard
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Cargando panel de administración...</span>
        </div>
      </div>
    );
  }

  const handleSalesUpdated = () => {
    // Reload dashboard data when sales are updated
    getDashboardData().then(setStats);
  };

  const cards = [
    {
      title: 'Ventas Totales Hoy',
      value: `S/. ${stats.todayTotalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: `Online: S/. ${stats.todayOnlineRevenue.toFixed(2)} | Local: S/. ${stats.todayLocalSales.toFixed(2)}`,
      highlight: true,
    },
    {
      title: 'Ventas Online',
      value: `S/. ${stats.todayOnlineRevenue.toFixed(2)}`,
      icon: Globe,
      description: `${stats.todayOnlineOrders} pedidos hoy`,
    },
    {
      title: 'Ventas Locales',
      value: `S/. ${stats.todayLocalSales.toFixed(2)}`,
      icon: Store,
      description: `${stats.todayLocalOrders} pedidos estimados`,
    },
    {
      title: 'Pedidos Online del Mes',
      value: stats.totalOnlineOrders,
      icon: ShoppingCart,
      description: `S/. ${stats.monthOnlineRevenue.toFixed(2)} facturado`,
    },
  ];

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    on_delivery: 'En Camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Unificado</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('es-PE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Unified Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className={card.highlight ? 'border-primary shadow-md' : ''}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.highlight ? 'text-primary' : ''}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Local Sales Form and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <LocalSalesForm 
          todayLocalSales={stats.todayLocalSales}
          onSalesUpdated={handleSalesUpdated}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Online Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{order.order_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer_name} - {order.customer_phone}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">S/. {order.total.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {statusLabels[order.order_status] || order.order_status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay pedidos online recientes</p>
                  <p className="text-sm">Los pedidos aparecerán aquí automáticamente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análisis del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.todayTotalRevenue > 0 
                  ? ((stats.todayOnlineRevenue / stats.todayTotalRevenue) * 100).toFixed(1)
                  : '0'
                }%
              </div>
              <div className="text-sm text-muted-foreground">Ventas Online</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.todayOnlineOrders + stats.todayLocalOrders}
              </div>
              <div className="text-sm text-muted-foreground">Total Pedidos Hoy</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                S/. {stats.todayTotalRevenue > 0 && (stats.todayOnlineOrders + stats.todayLocalOrders) > 0
                  ? (stats.todayTotalRevenue / (stats.todayOnlineOrders + stats.todayLocalOrders)).toFixed(2)
                  : '0.00'
                }
              </div>
              <div className="text-sm text-muted-foreground">Ticket Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Reports & Analytics */}
      <div className="mt-8">
        <BusinessReports />
      </div>
    </div>
  );
}
