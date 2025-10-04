'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  AlertCircle, 
  Timer,
  Users,
  Utensils,
  Package
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Order } from '@/lib/database.types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderWithItems extends Order {
  order_items: Array<{
    id: string
    quantity: number
    price: number
    notes?: string
    menu_items: {
      name: string
      category: string
    }
  }>
}

interface KitchenTicketsProps {
  className?: string
}

export function KitchenTickets({ className }: KitchenTicketsProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'preparing' | 'ready'>('pending')

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            notes,
            menu_items (
              name,
              category
            )
          )
        `)
        .in('status', ['pending', 'preparing', 'ready'])
        .order('created_at', { ascending: true })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error
      
      // Refresh orders
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('kitchen-orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: 'status=in.(pending,preparing,ready)'
        }, 
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'preparing':
        return <ChefHat className="h-4 w-4" />
      case 'ready':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'preparing':
        return 'Preparando'
      case 'ready':
        return 'Listo'
      default:
        return status
    }
  }

  const getTimeElapsed = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      const minutes = diffInMinutes % 60
      return `${hours}h ${minutes}m`
    }
  }

  const getUrgencyLevel = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    
    if (diffInMinutes > 30) return 'urgent'
    if (diffInMinutes > 15) return 'warning'
    return 'normal'
  }

  const renderOrderCard = (order: OrderWithItems) => {
    const urgency = getUrgencyLevel(order.created_at)
    const timeElapsed = getTimeElapsed(order.created_at)
    
    return (
      <Card 
        key={order.id} 
        className={cn(
          "mb-4 transition-all duration-200",
          urgency === 'urgent' && "border-red-300 bg-red-50",
          urgency === 'warning' && "border-orange-300 bg-orange-50"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", getStatusColor(order.status))}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{getStatusLabel(order.status)}</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                #{order.id.slice(-6)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span className={cn(
                urgency === 'urgent' && "text-red-600 font-medium",
                urgency === 'warning' && "text-orange-600 font-medium"
              )}>
                {timeElapsed}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {order.customer_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{format(new Date(order.created_at), 'HH:mm', { locale: es })}</span>
                {order.delivery_type === 'delivery' && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <Package className="h-3 w-3" />
                    <span>Delivery</span>
                  </>
                )}
                {order.delivery_type === 'pickup' && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <Users className="h-3 w-3" />
                    <span>Recojo</span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                S/ {order.total.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {order.order_items?.reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Order Items */}
            <div className="space-y-2">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs min-w-[24px] h-6 flex items-center justify-center">
                      {item.quantity}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{item.menu_items?.name}</p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          Nota: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.menu_items?.category}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-1">Notas del cliente:</p>
                <p className="text-sm text-blue-700">{order.notes}</p>
              </div>
            )}

            {/* Delivery Address */}
            {order.delivery_type === 'delivery' && order.delivery_address && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-800 mb-1">Dirección de entrega:</p>
                <p className="text-sm text-gray-700">{order.delivery_address}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {order.status === 'pending' && (
                <Button 
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="flex-1"
                  size="sm"
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  Iniciar Preparación
                </Button>
              )}
              
              {order.status === 'preparing' && (
                <Button 
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className="flex-1"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar Listo
                </Button>
              )}
              
              {order.status === 'ready' && (
                <Button 
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className="flex-1"
                  size="sm"
                  variant="outline"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Entregar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const pendingOrders = getOrdersByStatus('pending')
  const preparingOrders = getOrdersByStatus('preparing')
  const readyOrders = getOrdersByStatus('ready')

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Utensils className="h-6 w-6" />
            Tickets de Cocina
          </h2>
          <p className="text-muted-foreground">
            Gestión de pedidos en tiempo real
          </p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            {pendingOrders.length} Pendientes
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {preparingOrders.length} Preparando
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {readyOrders.length} Listos
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendientes ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="preparing" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Preparando ({preparingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="ready" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Listos ({readyOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <ScrollArea className="h-[600px]">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay pedidos pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map(renderOrderCard)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="preparing" className="mt-6">
          <ScrollArea className="h-[600px]">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay pedidos en preparación</p>
              </div>
            ) : (
              <div className="space-y-4">
                {preparingOrders.map(renderOrderCard)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ready" className="mt-6">
          <ScrollArea className="h-[600px]">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay pedidos listos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {readyOrders.map(renderOrderCard)}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}