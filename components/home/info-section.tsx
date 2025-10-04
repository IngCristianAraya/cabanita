import { Clock, Shield, Truck } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Abierto Todos los Días',
    description: 'De 11:00 AM a 9:00 PM para servir tus platos favoritos',
  },
  {
    icon: Truck,
    title: 'Delivery Rápido',
    description: 'Entrega en 30-45 minutos en zonas cercanas',
  },
  {
    icon: Shield,
    title: 'Calidad Garantizada',
    description: 'Solo utilizamos los ingredientes más frescos del mercado',
  },
];

export function InfoSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
