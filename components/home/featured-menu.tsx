import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/lib/database.types';
import { MenuItemCard } from '@/components/menu/menu-item-card';

export async function FeaturedMenu() {
  const { data: items } = await supabase
    .from('menu_items')
    .select('*, categories(name, slug, icon)')
    .eq('is_featured', true)
    .eq('is_available', true)
    .limit(6);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">
            Especialidades del Día
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Los platos más frescos y deliciosos de nuestra carta
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item as MenuItem} />
          ))}
        </div>
      </div>
    </section>
  );
}
