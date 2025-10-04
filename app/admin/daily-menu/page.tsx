import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyMenuManager } from '@/components/admin/daily-menu-manager';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyMenuPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Menú del Día</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los platos disponibles para hoy y programa menús futuros
          </p>
        </div>
      </div>

      <Suspense fallback={<DailyMenuSkeleton />}>
        <DailyMenuManager />
      </Suspense>
    </div>
  );
}

function DailyMenuSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}