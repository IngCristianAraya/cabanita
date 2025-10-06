'use client';

import { useEffect, useState } from 'react';

export default function ClientOnlyTest() {
  const [mounted, setMounted] = useState(false);
  
  console.log('🧪 ClientOnlyTest: Renderizando, mounted:', mounted);
  
  useEffect(() => {
    console.log('🔥 ClientOnlyTest: useEffect ejecutándose!');
    setMounted(true);
  }, []);
  
  if (!mounted) {
    console.log('🚫 ClientOnlyTest: No montado aún, retornando null');
    return null;
  }
  
  console.log('✅ ClientOnlyTest: Montado, renderizando contenido');
  
  return (
    <div className="p-4 border border-green-500 m-4">
      <h2>Client Only Test</h2>
      <p>Este componente solo se renderiza del lado del cliente</p>
    </div>
  );
}