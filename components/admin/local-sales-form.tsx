'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Store, DollarSign, Users } from 'lucide-react';

interface LocalSalesFormProps {
  onSalesUpdated?: () => void;
  todayLocalSales?: number;
}

export function LocalSalesForm({ onSalesUpdated, todayLocalSales = 0 }: LocalSalesFormProps) {
  const [totalAmount, setTotalAmount] = useState(todayLocalSales.toString());
  const [estimatedOrders, setEstimatedOrders] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const amount = parseFloat(totalAmount) || 0;
      const orders = parseInt(estimatedOrders) || 0;

      const { error } = await supabase
        .from('local_sales')
        .upsert({
          date: today,
          total_amount: amount,
          estimated_orders: orders,
          notes: notes.trim() || null,
        }, {
          onConflict: 'date'
        });

      if (error) throw error;

      toast({
        title: '✅ Ventas locales actualizadas',
        description: `Se registraron S/ ${amount.toFixed(2)} en ventas locales para hoy`,
      });

      if (onSalesUpdated) {
        onSalesUpdated();
      }
    } catch (error) {
      console.error('Error updating local sales:', error);
      toast({
        title: '❌ Error',
        description: 'No se pudieron actualizar las ventas locales',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const averageOrderValue = totalAmount && estimatedOrders 
    ? (parseFloat(totalAmount) / parseInt(estimatedOrders)).toFixed(2)
    : '0.00';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Ventas Locales de Hoy
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ingresa el total de ventas realizadas en el local para tener un dashboard completo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Vendido (S/)
              </Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedOrders" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pedidos Estimados
              </Label>
              <Input
                id="estimatedOrders"
                type="number"
                min="0"
                placeholder="0"
                value={estimatedOrders}
                onChange={(e) => setEstimatedOrders(e.target.value)}
              />
            </div>
          </div>

          {totalAmount && estimatedOrders && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Promedio por pedido: <span className="font-semibold">S/ {averageOrderValue}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ej: Día con promoción especial, evento, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Guardando...' : 'Actualizar Ventas Locales'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Solo toma 30 segundos al final del día. 
            Esto te permitirá ver el panorama completo de tu negocio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}