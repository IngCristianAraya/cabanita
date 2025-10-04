import { supabase } from '@/lib/supabase';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MenuItem, Category } from '@/lib/database.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MapPin, Clock } from 'lucide-react';

export const revalidate = 60;

async function getMenuData() {
  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true }),
    supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('name', { ascending: true }),
  ]);

  return {
    categories: categoriesResult.data || [],
    items: itemsResult.data || [],
  };
}

export default async function MenuPage() {
  const { categories, items } = await getMenuData();

  const getItemsByCategory = (categoryId: string) => {
    return items.filter((item) => item.category_id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16">
        <div className="container">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white/20 rounded-full backdrop-blur">
              <div className="text-3xl font-bold">🍽️</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nuestro Menú
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Explora nuestros deliciosos platos preparados con los ingredientes más frescos del mar peruano
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <Phone className="h-6 w-6 mx-auto mb-2 text-amber-200" />
              <div className="font-semibold text-sm">Pedidos</div>
              <div className="text-lg font-bold">945152916</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <Phone className="h-6 w-6 mx-auto mb-2 text-amber-200" />
              <div className="font-semibold text-sm">Información</div>
              <div className="text-lg font-bold">936415003</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-amber-200" />
              <div className="font-semibold text-sm">Ubicación</div>
              <div className="text-sm font-medium">Av. Universitaria 1637</div>
              <div className="text-xs text-amber-200">Frente a PUCP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8 bg-white/70 backdrop-blur">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => {
            const categoryItems = getItemsByCategory(category.id);

            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-amber-700 mb-2">{category.name}</h2>
                  {category.description && (
                    <p className="text-amber-600 text-lg">{category.description}</p>
                  )}
                </div>

                {categoryItems.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryItems.map((item) => (
                      <MenuItemCard key={item.id} item={item as MenuItem} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-white/70 backdrop-blur rounded-2xl p-8 max-w-md mx-auto">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-xl font-semibold text-amber-700 mb-2">
                        Próximamente
                      </h3>
                      <p className="text-amber-600">
                        Estamos preparando deliciosos platos para esta categoría
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Job Opportunities Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-8 text-white">
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
                <div className="font-semibold">Mozo</div>
                <div className="text-sm text-teal-200">Turno Noche</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="font-semibold">Ayudante Cocina</div>
                <div className="text-sm text-teal-200">Día y/o Noche</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
              <h4 className="font-semibold mb-2">Requisitos:</h4>
              <p className="text-sm text-teal-200">
                Certificado único laboral • DNI • CV • Carta de recomendación
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span className="font-bold text-lg">936415003</span>
              </div>
              <div className="text-teal-200">
                Envía tu información al número
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
