import { Fish, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <div className="text-2xl">🏠</div>
              </div>
              <span className="text-2xl font-bold">La Cabañita</span>
            </div>
            <p className="text-amber-100 leading-relaxed">
              Los mejores ceviches, mariscos y comida criolla de Lima.
              Frescura y sabor en cada plato, directo del mar peruano.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contacto</h3>
            <div className="space-y-3 text-amber-100">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-200" />
                <div>
                  <div className="font-semibold text-white">Pedidos: 945152916</div>
                  <div className="text-sm">Info: 936415003</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-200" />
                <span>contacto@lacabanita.pe</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-200" />
                <div>
                  <div className="font-semibold text-white">Av. Universitaria 1637</div>
                  <div className="text-sm">Frente a la puerta N°8 de PUCP</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Enlaces</h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block text-amber-100 hover:text-white transition-colors font-medium"
              >
                🏠 Inicio
              </Link>
              <Link
                href="/menu"
                className="block text-amber-100 hover:text-white transition-colors font-medium"
              >
                🍽️ Menú del día
              </Link>
              <Link
                href="https://www.facebook.com/lacabanitapucp"
                target="_blank"
                className="flex items-center gap-2 text-amber-100 hover:text-white transition-colors font-medium"
              >
                <Facebook className="h-5 w-5" />
                Síguenos en Facebook
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-400/30 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-amber-100">
              &copy; {new Date().getFullYear()} La Cabañita PUCP. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-amber-200">
              <span>🚚 Delivery disponible</span>
              <span>•</span>
              <span>⏰ Lun-Dom 11:00-22:00</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
