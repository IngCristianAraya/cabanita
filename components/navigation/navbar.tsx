'use client';

import Link from 'next/link';
import { Fish, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

export function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-24 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-18 w-auto">
              <img
                src="/images/logo_cabañita.png"
                alt="La Cabañita Logo"
                width={144}
                height={144}
                className="object-contain"
                loading="lazy"
              />
            </div>
          </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-teal-600 text-gray-700"
          >
            Inicio
          </Link>
          <Link
            href="/menu"
            className="text-sm font-medium transition-colors hover:text-teal-600 text-gray-700"
          >
            Menú
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-800">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Carrito
              {isMounted && itemCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-teal-500 hover:bg-teal-600">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-teal-700 hover:text-teal-800 hover:bg-teal-100">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gradient-to-b from-teal-50 to-yellow-50">
            <div className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-lg font-medium transition-colors hover:text-teal-600 text-gray-700"
              >
                Inicio
              </Link>
              <Link
                href="/menu"
                className="text-lg font-medium transition-colors hover:text-teal-600 text-gray-700"
              >
                Menú
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="w-full relative border-teal-500 text-teal-700 hover:bg-teal-50">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Carrito
                  {isMounted && itemCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-teal-500 hover:bg-teal-600">
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
