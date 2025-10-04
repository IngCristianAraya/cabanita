'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Clock,
  Truck,
  Store,
  Gift,
  AlertCircle,
  Heart,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  is_available: boolean
}

interface EnhancedCartProps {
  className?: string
}

export function EnhancedCart({ className }: EnhancedCartProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [suggestions, setSuggestions] = useState<MenuItem[]>([])
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [estimatedTime, setEstimatedTime] = useState(25)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const total = getTotal()
  const subtotal = total
  const deliveryFee = deliveryType === 'delivery' ? 5 : 0
  const finalTotal = subtotal - discount + deliveryFee

  // Fetch suggestions based on cart items
  const fetchSuggestions = async () => {
    if (items.length === 0) return

    try {
      const categories = [...new Set(items.map(item => item.category))]
      
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .in('category', categories)
        .eq('is_available', true)
        .not('id', 'in', `(${items.map(item => item.id).join(',')})`)
        .limit(3)

      setSuggestions(data || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [items])

  // Calculate estimated delivery time
  useEffect(() => {
    const baseTime = 20
    const itemsTime = items.reduce((acc, item) => acc + (item.quantity * 2), 0)
    const deliveryTime = deliveryType === 'delivery' ? 10 : 0
    setEstimatedTime(baseTime + itemsTime + deliveryTime)
  }, [items, deliveryType])

  const applyPromoCode = () => {
    // Simple promo code logic
    const promoCodes = {
      'PRIMERA10': 0.1, // 10% discount
      'CABAÑITA5': 5,   // S/ 5 off
      'DELIVERY': deliveryType === 'delivery' ? deliveryFee : 0 // Free delivery
    }

    const discountValue = promoCodes[promoCode as keyof typeof promoCodes]
    if (discountValue) {
      if (promoCode === 'PRIMERA10') {
        setDiscount(subtotal * discountValue)
      } else {
        setDiscount(discountValue)
      }
    }
  }

  const addSuggestionToCart = (suggestion: MenuItem) => {
    const cartStore = useCartStore.getState()
    cartStore.addItem({
      id: suggestion.id,
      name: suggestion.name,
      description: suggestion.description,
      price: suggestion.price,
      category: suggestion.category,
      image_url: suggestion.image_url,
      quantity: 1
    })
  }

  if (items.length === 0) {
    return (
      <div className={cn("container py-16", className)}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="relative mb-8">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-medium">0</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">
            ¡Descubre nuestros deliciosos platos frescos del mar!
          </p>
          
          <div className="space-y-4">
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar Menú
              </Button>
            </Link>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Entrega en 25-30 min</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8/5 estrellas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("container py-8", className)}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tu Carrito</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} • 
          Tiempo estimado: {estimatedTime} min
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Tipo de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={deliveryType === 'pickup' ? 'default' : 'outline'}
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => setDeliveryType('pickup')}
                >
                  <Store className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Recojo en Tienda</div>
                    <div className="text-xs text-muted-foreground">Gratis • 20-25 min</div>
                  </div>
                </Button>
                
                <Button
                  variant={deliveryType === 'delivery' ? 'default' : 'outline'}
                  className="h-auto p-4 flex-col gap-2"
                  onClick={() => setDeliveryType('delivery')}
                >
                  <Truck className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Delivery</div>
                    <div className="text-xs text-muted-foreground">S/ 5.00 • 30-35 min</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-2xl">🐟</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="w-12 text-center font-medium py-1 border-x">
                            {item.quantity}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-muted-foreground">
                              S/ {item.price.toFixed(2)} c/u
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Te podría gustar también
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-3 space-y-2">
                      <div className="h-16 w-full rounded bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
                        {suggestion.image_url ? (
                          <img
                            src={suggestion.image_url}
                            alt={suggestion.name}
                            className="object-cover w-full h-full rounded"
                          />
                        ) : (
                          <span className="text-xl">🐟</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{suggestion.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold">S/ {suggestion.price.toFixed(2)}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addSuggestionToCart(suggestion)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Instrucciones Especiales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="¿Alguna preferencia especial? (ej: sin cebolla, extra picante, etc.)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Summary */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Promo Code */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Código promocional"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Aplicar
                  </Button>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento aplicado</span>
                    <span>-S/ {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>S/ {deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-S/ {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>S/ {finalTotal.toFixed(2)}</span>
              </div>

              {/* Estimated Time */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Tiempo estimado: {estimatedTime} minutos
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Proceder al Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/menu">
                <Button variant="outline" size="sm" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}