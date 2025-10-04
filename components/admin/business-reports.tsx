'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Clock } from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface ReportData {
  totalRevenue: number
  totalOrders: number
  averageTicket: number
  onlineRevenue: number
  localRevenue: number
  onlineOrders: number
  localOrders: number
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  hourlyDistribution: Array<{
    hour: number
    orders: number
    revenue: number
  }>
  dailyTrend: Array<{
    date: string
    revenue: number
    orders: number
  }>
}

interface BusinessReportsProps {
  className?: string
}

export function BusinessReports({ className }: BusinessReportsProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 7),
    to: new Date()
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'custom'>('week')

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const { from, to } = dateRange
      
      // Fetch online orders data
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            menu_items (name)
          )
        `)
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString())

      // Fetch local sales data
      const { data: localSales } = await supabase
        .from('local_sales')
        .select('*')
        .gte('date', format(from, 'yyyy-MM-dd'))
        .lte('date', format(to, 'yyyy-MM-dd'))

      // Process data
      const onlineRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0
      const localRevenue = localSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0
      const onlineOrders = orders?.length || 0
      const localOrders = localSales?.reduce((sum, sale) => sum + (sale.estimated_orders || 0), 0) || 0

      // Calculate top products
      const productMap = new Map()
      orders?.forEach(order => {
        order.order_items?.forEach((item: any) => {
          const name = item.menu_items?.name || 'Producto desconocido'
          const existing = productMap.get(name) || { quantity: 0, revenue: 0 }
          productMap.set(name, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + (item.quantity * item.price)
          })
        })
      })

      const topProducts = Array.from(productMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate hourly distribution
      const hourlyMap = new Map()
      orders?.forEach(order => {
        const hour = new Date(order.created_at).getHours()
        const existing = hourlyMap.get(hour) || { orders: 0, revenue: 0 }
        hourlyMap.set(hour, {
          orders: existing.orders + 1,
          revenue: existing.revenue + order.total
        })
      })

      const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        ...(hourlyMap.get(hour) || { orders: 0, revenue: 0 })
      }))

      // Calculate daily trend
      const dailyMap = new Map()
      orders?.forEach(order => {
        const date = format(new Date(order.created_at), 'yyyy-MM-dd')
        const existing = dailyMap.get(date) || { orders: 0, revenue: 0 }
        dailyMap.set(date, {
          orders: existing.orders + 1,
          revenue: existing.revenue + order.total
        })
      })

      localSales?.forEach(sale => {
        const date = sale.date
        const existing = dailyMap.get(date) || { orders: 0, revenue: 0 }
        dailyMap.set(date, {
          orders: existing.orders + (sale.estimated_orders || 0),
          revenue: existing.revenue + sale.total_amount
        })
      })

      const dailyTrend = Array.from(dailyMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setReportData({
        totalRevenue: onlineRevenue + localRevenue,
        totalOrders: onlineOrders + localOrders,
        averageTicket: (onlineRevenue + localRevenue) / (onlineOrders + localOrders) || 0,
        onlineRevenue,
        localRevenue,
        onlineOrders,
        localOrders,
        topProducts,
        hourlyDistribution,
        dailyTrend
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const handlePeriodChange = (period: 'week' | 'month' | 'custom') => {
    setSelectedPeriod(period)
    const now = new Date()
    
    switch (period) {
      case 'week':
        setDateRange({
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 })
        })
        break
      case 'month':
        setDateRange({
          from: startOfMonth(now),
          to: endOfMonth(now)
        })
        break
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }

  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return null
    const growth = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(growth).toFixed(1),
      isPositive: growth > 0
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Period Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reportes y Analytics</h2>
          <p className="text-muted-foreground">
            Análisis detallado del rendimiento del negocio
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange('week')}
          >
            Esta Semana
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange('month')}
          >
            Este Mes
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={selectedPeriod === 'custom' ? 'default' : 'outline'}
                size="sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Personalizado
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                    setSelectedPeriod('custom')
                  }
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData?.totalRevenue || 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Online: {formatCurrency(reportData?.onlineRevenue || 0)}</span>
              <span>•</span>
              <span>Local: {formatCurrency(reportData?.localRevenue || 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.totalOrders || 0}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Online: {reportData?.onlineOrders || 0}</span>
              <span>•</span>
              <span>Local: {reportData?.localOrders || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(reportData?.averageTicket || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Ventas Online</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.totalRevenue ? 
                Math.round((reportData.onlineRevenue / reportData.totalRevenue) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Del total de ingresos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos Top</TabsTrigger>
          <TabsTrigger value="hours">Horarios</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>
                Ranking por ingresos generados en el período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData?.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Horarios</CardTitle>
              <CardDescription>
                Pedidos e ingresos por hora del día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportData?.hourlyDistribution
                  .filter(hour => hour.orders > 0)
                  .map((hour) => (
                    <div key={hour.hour} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {hour.hour.toString().padStart(2, '0')}:00
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{hour.orders} pedidos</span>
                        <span className="font-medium">
                          {formatCurrency(hour.revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia Diaria</CardTitle>
              <CardDescription>
                Evolución de ventas día a día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportData?.dailyTrend.map((day) => (
                  <div key={day.date} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">
                        {format(new Date(day.date), 'EEEE, dd MMM', { locale: es })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{day.orders} pedidos</span>
                      <span className="font-medium">
                        {formatCurrency(day.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}