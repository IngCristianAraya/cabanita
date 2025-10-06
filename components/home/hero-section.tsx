'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Banner real de La Cabañita */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/images/hero_cabañita.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Overlay para mejor legibilidad */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start mb-8">
              <img
                src="/images/logo_cabañita.png"
                alt="La Cabañita"
                width={200}
                height={120}
                className="h-24 w-auto drop-shadow-2xl"
                loading="lazy"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                <span className="text-teal-300">La</span>{' '}
                <span className="text-yellow-300">Cabañita</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-teal-100 font-medium italic drop-shadow-md">
                "Tu paladar es nuestra inspiración"
              </p>

              <p className="text-lg text-white max-w-2xl drop-shadow-md">
                Descubre los auténticos sabores del mar peruano y la cocina criolla. 
                Ceviches frescos, platos tradicionales y la mejor experiencia gastronómica 
                te esperan en cada bocado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/menu">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg shadow-xl">
                  Ver Menú
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" size="lg" className="border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-gray-900 px-8 py-4 text-lg shadow-xl backdrop-blur-sm bg-white/10">
                  Hacer Pedido
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/20">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white">
                <Phone className="h-5 w-5 text-teal-300" />
                <span className="text-sm drop-shadow-md">+51 945 152 916</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white">
                <Clock className="h-5 w-5 text-yellow-300" />
                <span className="text-sm drop-shadow-md">11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white">
                <MapPin className="h-5 w-5 text-gray-300" />
                <span className="text-sm drop-shadow-md">Lima, Perú</span>
              </div>
            </div>
          </div>

          {/* Ceviche Image - Plato estrella */}
          <div className="relative">
            <div className="relative z-10 bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="/images/ceviche.jpg"
                  alt="Ceviche Fresco - Plato Estrella de La Cabañita"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4 space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">Ceviche Fresco</h3>
                <p className="text-gray-600">Nuestro plato estrella preparado al momento</p>
                <div className="bg-teal-600 text-white px-6 py-2 rounded-full text-lg font-semibold">
                  Desde S/ 18.00
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-4 rounded-full shadow-lg animate-bounce">
              <span className="text-2xl">🦐</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-teal-500 text-white p-4 rounded-full shadow-lg animate-pulse">
              <span className="text-2xl">🐙</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
