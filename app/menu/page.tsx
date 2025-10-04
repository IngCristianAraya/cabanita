'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/lib/database.types';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Clock, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DailyMenuItem extends MenuItem {
  categories: {
    name: string;
    slug: string;
  };
  daily_availability?: boolean;
  special_price?: number;
}

interface DailyMenu {
  id: string;
  menu_date: string;
  is_published: boolean;
  special_note?: string;
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('entradas');
  const [menuItems, setMenuItems] = useState<DailyMenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      
      // Get today's date in YYYY-MM-DD format
      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return;
      }

      // Fetch menu items
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true);

      if (menuItemsError) {
        console.error('Error fetching menu items:', menuItemsError);
        return;
      }

      // Fetch today's daily menu
      const { data: dailyMenuData, error: dailyMenuError } = await supabase
        .from('daily_menus')
        .select(`
          *,
          daily_menu_items (
            menu_item_id,
            is_available
          )
        `)
        .eq('menu_date', today)
        .single();

      if (dailyMenuError && dailyMenuError.code !== 'PGRST116') {
        console.error('Error fetching daily menu:', dailyMenuError);
      }

      setCategories(categoriesData || []);
      setMenuItems(menuItemsData || []);
      setDailyMenu(dailyMenuData);

      // Set first category as selected if available
      if (categoriesData && categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].slug);
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemsByCategory = (categorySlug: string) => {
    return menuItems.filter((item) => item.categories.slug === categorySlug);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-yellow-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-600">Cargando menú del día...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-yellow-50 to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white/20 rounded-full backdrop-blur">
              <div className="text-3xl font-bold">🐟</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Menú de La Cabañita
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Explora nuestros deliciosos platos preparados con los ingredientes más frescos del mar peruano
            </p>
            
            {/* Daily Menu Info */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5 text-teal-200" />
              <span className="text-teal-200">
                Menú del {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: es })}
              </span>
              {dailyMenu?.is_published && (
                <Badge className="bg-green-500 text-white ml-2">
                  Actualizado
                </Badge>
              )}
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <Phone className="h-6 w-6 mx-auto mb-2 text-teal-200" />
              <div className="font-semibold text-sm">Pedidos</div>
              <div className="text-lg font-bold">945152916</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-200" />
              <div className="font-semibold text-sm">Horario</div>
              <div className="text-lg font-bold">11:00 AM - 10:00 PM</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-gray-200" />
              <div className="font-semibold text-sm">Ubicación</div>
              <div className="text-lg font-bold">Lima, Perú</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container py-12">
        {/* Daily Special Note */}
        {dailyMenu?.special_note && (
          <Alert className="mb-8 border-teal-200 bg-teal-50">
            <AlertCircle className="h-4 w-4 text-teal-600" />
            <AlertDescription className="text-teal-700">
              <strong>Especial del día:</strong> {dailyMenu.special_note}
            </AlertDescription>
          </Alert>
        )}

        {categories.length > 0 ? (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.slug} 
                  value={category.slug}
                  className="data-[state=active]:bg-teal-600 data-[state=active]:text-white text-xs lg:text-sm"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const categoryItems = getItemsByCategory(category.slug);

              return (
                <TabsContent key={category.slug} value={category.slug}>
                  <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-teal-800 mb-2">{category.name}</h2>
                    {category.description && (
                      <p className="text-teal-600 text-lg">{category.description}</p>
                    )}
                  </div>

                  {categoryItems.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-white/70 backdrop-blur rounded-2xl p-8 max-w-md mx-auto">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-teal-700 mb-2">
                          No disponible hoy
                        </h3>
                        <p className="text-teal-600">
                          Los platos de esta categoría no están disponibles hoy. ¡Vuelve mañana para ver nuevas opciones!
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                Menú en preparación
              </h3>
              <p className="text-teal-600">
                Estamos preparando el menú del día. ¡Vuelve pronto!
              </p>
            </div>
          </div>
        )}

        {/* Job Opportunities Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-3xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">¡Únete a Nuestro Equipo!</h3>
            <p className="text-lg mb-6 text-teal-100">
              "La Cabañita" requiere personal para diferentes posiciones
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="font-semibold">Mozo Part Time</div>
                <div className="text-sm text-teal-200">Turno Día</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="font-semibold">Mozo Full Time</div>
                <div className="text-sm text-teal-200">Turno Día</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="font-semibold">Repartidor</div>
                <div className="text-sm text-teal-200">Con Bicicleta/Moto</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="font-semibold">Cocinero</div>
                <div className="text-sm text-teal-200">Experiencia en Mariscos</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="font-semibold">Cajero</div>
                <div className="text-sm text-teal-200">Turno Completo</div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 max-w-md mx-auto">
              <div className="font-semibold mb-2">Contacto para Postulaciones</div>
              <div className="text-teal-200">WhatsApp: +51 945 152 916</div>
              <div className="text-teal-200">Horario: 9:00 AM - 6:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
