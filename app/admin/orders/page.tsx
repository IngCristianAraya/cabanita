import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderStatusSelect } from '@/components/admin/order-status-select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Order } from '@/lib/database.types';

export const revalidate = 0;

async function getOrders() {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (data || []) as Order[];
}

const statusConfig: Record<string, { label: string; variant: any }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  on_delivery: { label: 'En Camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'default' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Pedidos ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.order_status];
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{order.order_number}</span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.customer_name} • {order.customer_phone}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('es-PE')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg mb-1">
                      S/. {order.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.payment_method.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.order_status} />
                    <Link href={`/order/${order.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay pedidos registrados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
