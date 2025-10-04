'use client';

import Link from 'next/link';
import { Fish, ShoppingCart, Menu } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-18 w-auto">
              <Image
                src="/images/logo_cabañita.png"
                alt="La Cabañita Logo"
                width={144}
                height={144}
                className="object-contain"
                priority
              />
            </div>
          </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-amber-600 text-amber-800"
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            className="text-sm font-medium transition-colors hover:text-amber-600 text-amber-800"
          >
            Menú
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Carrito
              {itemCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-amber-500 hover:bg-amber-600">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gradient-to-b from-amber-50 to-orange-50">
            <div className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium transition-colors hover:text-amber-600 text-amber-800"
              >
                Inicio
              </Link>
              <Link
                href="/menu"
                className="text-lg font-medium transition-colors hover:text-amber-600 text-amber-800"
              >
                Menú
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="w-full relative border-amber-500 text-amber-700 hover:bg-amber-50">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Carrito
                  {itemCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-amber-500 hover:bg-amber-600">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
