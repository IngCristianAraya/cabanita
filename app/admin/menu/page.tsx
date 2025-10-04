import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { MenuItemToggle } from '@/components/admin/menu-item-toggle';

export const revalidate = 0;

async function getMenuItems() {
  const { data } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .order('name');

  return data || [];
}

export default async function AdminMenuPage() {
  const items = await getMenuItems();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión de Menú</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Platos ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="h-16 w-16 rounded-md bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="object-cover w-full h-full rounded-md"
                    />
                  ) : (
                    <span className="text-2xl">🐟</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{item.name}</span>
                    {item.is_featured && <Badge>Destacado</Badge>}
                    {!item.is_available && (
                      <Badge variant="secondary">No disponible</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.categories?.name}
                  </div>
                  <div className="text-sm line-clamp-1 text-muted-foreground">
                    {item.description}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">
                    S/. {item.price.toFixed(2)}
                  </div>
                </div>

                <MenuItemToggle itemId={item.id} isAvailable={item.is_available} />
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay platos registrados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
