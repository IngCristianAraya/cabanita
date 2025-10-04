'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface MenuItemToggleProps {
  itemId: string;
  isAvailable: boolean;
}

export function MenuItemToggle({ itemId, isAvailable }: MenuItemToggleProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [available, setAvailable] = useState(isAvailable);

  const handleToggle = async (checked: boolean) => {
    setAvailable(checked);

    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: checked, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la disponibilidad',
        variant: 'destructive',
      });
      setAvailable(isAvailable);
    } else {
      toast({
        title: 'Disponibilidad actualizada',
        description: `El plato está ahora ${checked ? 'disponible' : 'no disponible'}`,
      });
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={`available-${itemId}`}
        checked={available}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor={`available-${itemId}`} className="cursor-pointer">
        {available ? 'Disponible' : 'No disponible'}
      </Label>
    </div>
  );
}
