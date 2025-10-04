'use client';

import { MenuItem } from '@/lib/database.types';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { demoData } from '@/lib/demo-data';

export function FeaturedMenu() {
  // Seleccionar los platos destacados de La Cabañita
  const featuredItems: MenuItem[] = [
    {
      id: '1',
      name: 'Ceviche Clásico',
      price: 18,
      description: 'Pescado fresco marinado en limón con cebolla, ají limo y camote',
      category: 'Ceviches',
      is_available: true,
      is_featured: true,
      spicy_level: 2,
      image_url: '/images/ceviche.jpg'
    },
    {
      id: '5',
      name: 'Arroz con Mariscos',
      price: 32,
      description: 'Arroz amarillo con mariscos frescos y culantro',
      category: 'Principales',
      is_available: true,
      is_featured: true,
      spicy_level: 1,
      image_url: null
    },
    {
      id: '10',
      name: 'Lomo Saltado',
      price: 24,
      description: 'Lomo de res saltado con papas fritas y arroz',
      category: 'Criollos',
      is_available: true,
      is_featured: true,
      spicy_level: 1,
      image_url: null
    },
    {
      id: '8',
      name: 'Chupe de Camarones',
      price: 38,
      description: 'Sopa cremosa de camarones con huevo y queso',
      category: 'Principales',
      is_available: true,
      is_featured: true,
      spicy_level: 2,
      image_url: null
    },
    {
      id: '21',
      name: 'Pisco Sour',
      price: 15,
      description: 'Cóctel tradicional peruano',
      category: 'Bebidas',
      is_available: true,
      is_featured: true,
      spicy_level: 0,
      image_url: null
    },
    {
      id: '23',
      name: 'Suspiro Limeño',
      price: 12,
      description: 'Dulce de leche con merengue',
      category: 'Postres',
      is_available: true,
      is_featured: true,
      spicy_level: 0,
      image_url: null
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 via-yellow-50 to-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-teal-800">
            Especialidades de La Cabañita
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Los sabores auténticos del mar peruano y la cocina criolla
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
