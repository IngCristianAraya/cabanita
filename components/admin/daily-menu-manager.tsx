'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Save, Plus, Eye, EyeOff, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_available: boolean;
  is_featured: boolean;
  image_url?: string;
  categories: {
    name: string;
    slug: string;
  };
}

interface DailyMenu {
  id: string;
  menu_date: string;
  is_published: boolean;
  special_note?: string;
  daily_menu_items: {
    id: string;
    menu_item_id: string;
    is_available: boolean;
    special_price?: number;
  }[];
}

export function DailyMenuManager() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [specialNote, setSpecialNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMenuItems();
    loadDailyMenu();
  }, [selectedDate]);

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*, categories(name, slug)')
        .order('name');

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los platos del menú',
        variant: 'destructive',
      });
    }
  };

  const loadDailyMenu = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_menus')
        .select(`
          *,
          daily_menu_items(
            id,
            menu_item_id,
            is_available,
            special_price
          )
        `)
        .eq('menu_date', selectedDate)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setDailyMenu(data);
      setSpecialNote(data?.special_note || '');
    } catch (error) {
      console.error('Error loading daily menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDailyMenu = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_menus')
        .insert({
          menu_date: selectedDate,
          is_published: false,
          special_note: specialNote,
        })
        .select()
        .single();

      if (error) throw error;
      
      setDailyMenu(data);
      toast({
        title: 'Éxito',
        description: 'Menú del día creado correctamente',
      });
    } catch (error) {
      console.error('Error creating daily menu:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el menú del día',
        variant: 'destructive',
      });
    }
  };

  const toggleItemAvailability = async (menuItemId: string, isAvailable: boolean) => {
    if (!dailyMenu) {
      await createDailyMenu();
      return;
    }

    try {
      const existingItem = dailyMenu.daily_menu_items.find(
        item => item.menu_item_id === menuItemId
      );

      if (existingItem) {
        // Update existing item
        const { error } = await supabase
          .from('daily_menu_items')
          .update({ is_available: isAvailable })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('daily_menu_items')
          .insert({
            daily_menu_id: dailyMenu.id,
            menu_item_id: menuItemId,
            is_available: isAvailable,
          });

        if (error) throw error;
      }

      // Reload daily menu
      await loadDailyMenu();
    } catch (error) {
      console.error('Error toggling item availability:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la disponibilidad del plato',
        variant: 'destructive',
      });
    }
  };

  const saveDailyMenu = async () => {
    if (!dailyMenu) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('daily_menus')
        .update({
          special_note: specialNote,
          is_published: true,
        })
        .eq('id', dailyMenu.id);

      if (error) throw error;

      await loadDailyMenu();
      toast({
        title: 'Éxito',
        description: 'Menú del día guardado y publicado',
      });
    } catch (error) {
      console.error('Error saving daily menu:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el menú del día',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getItemAvailability = (menuItemId: string) => {
    if (!dailyMenu) return false;
    const item = dailyMenu.daily_menu_items.find(
      item => item.menu_item_id === menuItemId
    );
    return item?.is_available || false;
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.categories.name;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const today = format(new Date(), 'yyyy-MM-dd');
  const isToday = selectedDate === today;
  const isPast = selectedDate < today;

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seleccionar Fecha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6].map((days) => {
              const date = format(addDays(new Date(), days), 'yyyy-MM-dd');
              const isSelected = selectedDate === date;
              const isCurrentDay = date === today;
              
              return (
                <Button
                  key={date}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDate(date)}
                  className="relative"
                >
                  {format(addDays(new Date(), days), 'EEE dd/MM', { locale: es })}
                  {isCurrentDay && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs">
                      HOY
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Menu Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Menú del {format(new Date(selectedDate), 'EEEE, dd MMMM yyyy', { locale: es })}
            </div>
            <div className="flex items-center gap-2">
              {dailyMenu?.is_published ? (
                <Badge className="bg-green-100 text-green-800">
                  <Eye className="h-3 w-3 mr-1" />
                  Publicado
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Borrador
                </Badge>
              )}
              {isPast && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Pasado
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nota especial del día (opcional)
              </label>
              <Textarea
                placeholder="Ej: Hoy tenemos ceviche de pescado fresco del día..."
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                disabled={isPast}
              />
            </div>
            
            {!dailyMenu && !isPast && (
              <Button onClick={createDailyMenu} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Crear Menú del Día
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items by Category */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Cargando menú...</div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={Object.keys(groupedItems)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {Object.keys(groupedItems).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedItems).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <Card>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const isAvailable = getItemAvailability(item.id);
                      
                      return (
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
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <div className="text-lg font-bold text-primary">
                              S/ {item.price.toFixed(2)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={isAvailable}
                              onCheckedChange={(checked) => 
                                toggleItemAvailability(item.id, checked)
                              }
                              disabled={isPast}
                            />
                            <span className="text-sm text-muted-foreground">
                              {isAvailable ? 'Disponible' : 'No disponible'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Save Button */}
      {dailyMenu && !isPast && (
        <div className="flex justify-end">
          <Button 
            onClick={saveDailyMenu} 
            disabled={isSaving}
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar y Publicar Menú'}
          </Button>
        </div>
      )}
    </div>
  );
}