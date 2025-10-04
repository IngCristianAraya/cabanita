import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Truck, Utensils, Leaf } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Background image - configuración para imagen ancha con poca altura */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/do2rpqupm/image/upload/v1759536903/hero_caba%C3%B1ita_zaffem.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      />
      {/* Overlay más sutil para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content */}
      <div className="container relative z-10 text-center">
        <div className="max-w-3xl mx-auto text-white">
          {/* Logo - replicando el diseño del banner de Facebook */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Image
                src="/images/logo_cabañita.png"
                alt="La Cabañita Logo"
                width={700}
                height={700}
                className="object-contain drop-shadow-2xl max-w-lg md:max-w-2xl lg:max-w-3xl"
                priority
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-amber-50 mb-6 font-medium drop-shadow-lg">
            Tu paladar nuestra inspiración...!!!
          </p>

          {/* Delivery Badge - centrado como en el banner */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-teal-500/90 text-white px-6 py-3 rounded-full shadow-xl">
              <Truck className="h-5 w-5" />
              <span className="font-semibold text-sm md:text-base">DELIVERY O RECOJO EN TIENDA</span>
            </div>
          </div>

          {/* Phone - más prominente como en el banner */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Phone className="h-7 w-7 text-teal-400" />
            <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">945152916</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link href="/menu">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 shadow-xl transition-transform duration-300 hover:scale-105"
              >
                Ver Menú del Día
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white text-lg px-8 py-4 shadow-xl transition-transform duration-300 hover:scale-105"
              >
                Hacer Pedido
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            <div className="rounded-2xl bg-white/90 backdrop-blur border border-gray-200 p-6 shadow-xl">
              <Utensils className="mx-auto mb-3 h-8 w-8 text-yellow-500" />
              <div className="text-4xl font-bold text-yellow-500">15+</div>
              <div className="mt-2 text-gray-600 font-medium">Platos Frescos</div>
            </div>
            <div className="rounded-2xl bg-white/90 backdrop-blur border border-gray-200 p-6 shadow-xl">
              <Truck className="mx-auto mb-3 h-8 w-8 text-green-600" />
              <div className="text-4xl font-bold text-green-600">30min</div>
              <div className="mt-2 text-gray-600 font-medium">Delivery Rápido</div>
            </div>
            <div className="rounded-2xl bg-white/90 backdrop-blur border border-gray-200 p-6 shadow-xl">
              <Leaf className="mx-auto mb-3 h-8 w-8 text-green-500" />
              <div className="text-4xl font-bold text-green-500">100%</div>
              <div className="mt-2 text-gray-600 font-medium">Ingredientes Naturales</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
