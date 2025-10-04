import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, UtensilsCrossed, TrendingUp } from 'lucide-react';
import { Order } from '@/lib/database.types';

export const revalidate = 0;

async function getDashboardData() {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const [ordersResult, todayOrdersResult, monthOrdersResult, menuItemsResult] = await Promise.all([
    supabase.from('orders').select('total', { count: 'exact' }),
    supabase.from('orders').select('total').gte('created_at', today),
    supabase.from('orders').select('total').gte('created_at', `${thisMonth}-01`),
    supabase.from('menu_items').select('*', { count: 'exact' }),
  ]);

  const totalRevenue = (ordersResult.data as any[])?.reduce((sum, order) => sum + order.total, 0) || 0;
  const todayRevenue = (todayOrdersResult.data as any[])?.reduce((sum, order) => sum + order.total, 0) || 0;
  const monthRevenue = (monthOrdersResult.data as any[])?.reduce((sum, order) => sum + order.total, 0) || 0;

  return {
    totalOrders: ordersResult.count || 0,
    todayOrders: todayOrdersResult.data?.length || 0,
    monthRevenue,
    todayRevenue,
    totalMenuItems: menuItemsResult.count || 0,
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

export default async function AdminDashboard() {
  const stats = await getDashboardData();
  const recentOrders = await getRecentOrders();

  const cards = [
    {
      title: 'Ventas del Mes',
      value: `S/. ${stats.monthRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: `S/. ${stats.todayRevenue.toFixed(2)} hoy`,
    },
    {
      title: 'Pedidos Totales',
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: `${stats.todayOrders} hoy`,
    },
    {
      title: 'Platos en Menú',
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      description: 'Platos disponibles',
    },
    {
      title: 'Promedio por Pedido',
      value: `S/. ${stats.totalOrders > 0 ? (stats.monthRevenue / stats.totalOrders).toFixed(2) : '0.00'}`,
      icon: TrendingUp,
      description: 'Este mes',
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
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
