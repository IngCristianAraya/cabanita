'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/database.types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Flame } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(item, quantity);
    toast({
      title: 'Agregado al carrito',
      description: `${quantity}x ${item.name}`,
    });
    setQuantity(1);
  };

  const spicyIcons = Array.from({ length: item.spicy_level || 0 });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-6xl">🐟</div>
        )}
        {item.is_featured && (
          <Badge className="absolute top-2 right-2">Destacado</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          {item.spicy_level > 0 && (
            <div className="flex gap-0.5">
              {spicyIcons.map((_, i) => (
                <Flame key={i} className="h-4 w-4 text-orange-500 fill-orange-500" />
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="text-2xl font-bold text-primary">
          S/. {item.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button className="flex-1" onClick={handleAddToCart}>
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
