'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { whatsappService } from '@/lib/whatsapp';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Phone, Clock, CheckCircle, ExternalLink } from 'lucide-react';

interface WhatsAppPanelProps {
  recentOrders?: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    total: number;
    order_status: string;
    order_items: Array<{
      menu_item: { name: string; price: number };
      quantity: number;
    }>;
  }>;
}

export function WhatsAppPanel({ recentOrders = [] }: WhatsAppPanelProps) {
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [customPhone, setCustomPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const templates = whatsappService.getQuickTemplates();

  const handleSendOrderNotification = async (orderId: string) => {
    const order = recentOrders.find(o => o.id === orderId);
    if (!order) return;

    setIsLoading(true);
    try {
      const orderNotification = {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        total: order.total,
        status: order.order_status,
        items: order.order_items.map(item => ({
          name: item.menu_item.name,
          quantity: item.quantity,
          price: item.menu_item.price
        }))
      };

      const result = await whatsappService.sendOrderNotifications(orderNotification);
      
      if (result.customerSent) {
        toast({
          title: '✅ Mensaje enviado',
          description: `Notificación enviada a ${order.customer_name}`,
        });
      } else {
        throw new Error('No se pudo enviar el mensaje');
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'No se pudo enviar la notificación',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCustomMessage = async () => {
    if (!customPhone || !customMessage) return;

    setIsLoading(true);
    try {
      // Generate WhatsApp link for manual sending
      const link = whatsappService.generateWhatsAppLink(customPhone, customMessage);
      window.open(link, '_blank');
      
      toast({
        title: '📱 WhatsApp abierto',
        description: 'Se abrió WhatsApp con el mensaje preparado',
      });
      
      setCustomMessage('');
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'No se pudo abrir WhatsApp',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      on_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      on_delivery: 'En Camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Centro de Notificaciones WhatsApp
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Envía notificaciones automáticas y mensajes personalizados a tus clientes
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Pedidos Recientes</TabsTrigger>
            <TabsTrigger value="custom">Mensaje Personalizado</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{order.order_number}</span>
                        <Badge className={getStatusColor(order.order_status)}>
                          {getStatusLabel(order.order_status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer_name} - {order.customer_phone}
                      </div>
                      <div className="text-sm font-medium">
                        S/ {order.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = whatsappService.generateWhatsAppLink(
                            order.customer_phone,
                            `Hola ${order.customer_name}! Tu pedido #${order.order_number} está siendo procesado. ¡Gracias por elegirnos! 🍽️`
                          );
                          window.open(link, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendOrderNotification(order.id)}
                        disabled={isLoading}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Notificar
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay pedidos recientes</p>
                  <p className="text-sm">Los pedidos aparecerán aquí para enviar notificaciones</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customPhone">Número de teléfono</Label>
                <Input
                  id="customPhone"
                  placeholder="Ej: 987654321"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customMessage">Mensaje</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Escribe tu mensaje personalizado..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleSendCustomMessage}
                disabled={!customPhone || !customMessage || isLoading}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Abrir en WhatsApp
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Pedido Listo
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  "Hola [Cliente]! Tu pedido #[Número] está listo para recoger. ¡Te esperamos! 🍽️"
                </p>
                <Button size="sm" variant="outline">
                  Usar Plantilla
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  Retraso en Pedido
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  "Hola [Cliente]! Tu pedido se retrasará [X] minutos adicionales. Disculpa las molestias. 🙏"
                </p>
                <Button size="sm" variant="outline">
                  Usar Plantilla
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  Agradecimiento
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  "¡Gracias por tu pedido, [Cliente]! Esperamos que hayas disfrutado tu comida. ¡Vuelve pronto! 😊"
                </p>
                <Button size="sm" variant="outline">
                  Usar Plantilla
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Sistema de Notificaciones Inteligente
              </h4>
              <p className="text-sm text-blue-800">
                Las notificaciones se envían automáticamente cuando cambias el estado de un pedido. 
                También puedes enviar mensajes personalizados desde aquí.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}