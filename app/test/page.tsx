'use client';

import { useEffect, useState } from 'react';
import ClientOnlyTest from '@/components/ClientOnlyTest';

export default function TestPage() {
  console.log('🧪 TestPage: Renderizando');
  
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('🔥 TestPage: useEffect ejecutándose!');
  }, []);
  
  useEffect(() => {
    console.log('🔥 TestPage: useEffect con count ejecutándose!', count);
  }, [count]);
  
  return (
    <div className="p-8">
      <h1>Página de Prueba</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Incrementar
      </button>
      <ClientOnlyTest />
    </div>
  );
}