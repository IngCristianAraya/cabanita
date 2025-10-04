import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircleCheck as CheckCircle2, Clock, Package, Truck, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OrderPageProps {
  params: {
    id: string;
  };
}

const statusConfig = {
  pending: { label: 'Pendiente', icon: Clock, color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmado', icon: CheckCircle2, color: 'bg-blue-500' },
  preparing: { label: 'Preparando', icon: Package, color: 'bg-orange-500' },
  on_delivery: { label: 'En Camino', icon: Truck, color: 'bg-purple-500' },
  delivered: { label: 'Entregado', icon: CheckCircle2, color: 'bg-green-500' },
  cancelled: { label: 'Cancelado', icon: Clock, color: 'bg-red-500' },
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, menu_items(name, price))')
    .eq('id', params.id)
    .single();

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.order_status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full ${status.color} text-white mb-4`}>
            <StatusIcon className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Pedido {status.label}
          </h1>
          <p className="text-muted-foreground">
            Número de pedido: <span className="font-semibold">{order.order_number}</span>
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.menu_items?.name}
                  </span>
                  <span className="font-medium">
                    S/. {item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>S/. {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>S/. {order.delivery_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/. {order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.delivery_address}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{order.customer_phone}</span>
              </div>

              {order.customer_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{order.customer_email}</span>
                </div>
              )}

              {order.notes && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium mb-1">Notas</div>
                  <div className="text-sm text-muted-foreground">{order.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="capitalize">
                  {order.payment_method === 'cash' && 'Efectivo al entregar'}
                  {order.payment_method === 'yape' && 'Yape'}
                  {order.payment_method === 'plin' && 'Plin'}
                  {order.payment_method === 'card' && 'Tarjeta'}
                </span>
                <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                  {order.payment_status === 'completed' ? 'Pagado' : 'Pendiente'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link href="/menu" className="flex-1">
              <Button variant="outline" className="w-full">
                Hacer otro pedido
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
