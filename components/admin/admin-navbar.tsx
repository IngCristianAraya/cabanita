'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fish, LayoutDashboard, UtensilsCrossed, ShoppingCart, ChefHat, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function AdminNavbar() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Fish className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-primary">La Cabañita Admin</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menú
          </Link>
          <Link
            href="/admin/daily-menu"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Calendar className="h-4 w-4" />
            Menú Diario
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <ShoppingCart className="h-4 w-4" />
            Pedidos
          </Link>
          <Link
            href="/admin/kitchen"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <ChefHat className="h-4 w-4" />
            Cocina
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
    </nav>
  );
}
