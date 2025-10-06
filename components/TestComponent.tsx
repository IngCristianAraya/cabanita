'use client';

import { useEffect, useState } from 'react';

export default function TestComponent() {
  console.log('🧪 TestComponent: Renderizando');
  
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('🔥 TestComponent: useEffect ejecutándose!');
    console.log('🔥 TestComponent: count actual:', count);
  }, [count]);
  
  useEffect(() => {
    console.log('🚀 TestComponent: useEffect inicial ejecutándose!');
  }, []);
  
  return (
    <div className="p-4 border border-red-500 m-4">
      <h2>Test Component</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Incrementar
      </button>
    </div>
  );
}