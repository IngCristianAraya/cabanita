// Datos de demostración para mostrar la funcionalidad del sistema
export const demoData = {
  orders: [
    {
      id: '1',
      created_at: new Date().toISOString(),
      customer_name: 'Ana Rodríguez',
      customer_phone: '+51 987 654 321',
      total: 46,
      status: 'pending',
      items: [
        { name: 'Ceviche Clásico', quantity: 1, price: 18 },
        { name: 'Arroz con Mariscos', quantity: 1, price: 32 },
        { name: 'Chicha Morada', quantity: 2, price: 8 }
      ]
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      customer_name: 'Carlos Mendoza',
      customer_phone: '+51 945 152 916',
      total: 53,
      status: 'preparing',
      items: [
        { name: 'Ceviche Mixto', quantity: 1, price: 25 },
        { name: 'Jalea Mixta', quantity: 1, price: 35 },
        { name: 'Pisco Sour', quantity: 1, price: 15 }
      ]
    },
    {
      id: '3',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      customer_name: 'María Gonzales',
      customer_phone: '+51 955 123 456',
      total: 42,
      status: 'ready',
      items: [
        { name: 'Lomo Saltado', quantity: 1, price: 24 },
        { name: 'Yuca Frita', quantity: 1, price: 8 },
        { name: 'Jugo de Maracuyá', quantity: 1, price: 10 }
      ]
    }
  ],
  
  localSales: [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      total_amount: 850,
      estimated_orders: 35,
      notes: 'Día normal de ventas locales - La Cabañita'
    }
  ],

  menuItems: [
    // ENTRADAS (Platos Variables - Cambian según disponibilidad)
    { id: '1', name: 'Causa Limeña', price: 12, category: 'Entradas', available: true, description: 'Papa amarilla con pollo y palta', isVariable: true },
    { id: '2', name: 'Papa Rellena', price: 8, category: 'Entradas', available: true, description: 'Papa rellena con carne y huevo', isVariable: true },
    { id: '3', name: 'Anticuchos (2 unid)', price: 15, category: 'Entradas', available: false, description: 'Brochetas de corazón marinado', isVariable: true },
    { id: '4', name: 'Tequeños (6 unid)', price: 10, category: 'Entradas', available: true, description: 'Tequeños de queso crujientes', isVariable: true },
    
    // MENÚS S/13 (Platos Variables - Rotan según el día)
    { id: '5', name: 'Pollo Guisado + Arroz + Menestra', price: 13, category: 'Menús S/13', available: true, description: 'Menú ejecutivo del día', isVariable: true },
    { id: '6', name: 'Estofado de Pollo + Arroz + Yuca', price: 13, category: 'Menús S/13', available: true, description: 'Menú ejecutivo del día', isVariable: true },
    { id: '7', name: 'Seco de Cabrito + Arroz + Frijoles', price: 13, category: 'Menús S/13', available: false, description: 'Menú ejecutivo del día', isVariable: true },
    { id: '8', name: 'Ají de Gallina + Arroz + Papa', price: 13, category: 'Menús S/13', available: true, description: 'Menú ejecutivo del día', isVariable: true },
    
    // MENÚS S/15 (Platos Variables - Rotan según el día)
    { id: '9', name: 'Lomo Saltado + Arroz + Papas', price: 15, category: 'Menús S/15', available: true, description: 'Menú premium del día', isVariable: true },
    { id: '10', name: 'Pollo a la Plancha + Ensalada + Arroz', price: 15, category: 'Menús S/15', available: true, description: 'Menú premium del día', isVariable: true },
    { id: '11', name: 'Pescado Sudado + Arroz + Yuca', price: 15, category: 'Menús S/15', available: false, description: 'Menú premium del día', isVariable: true },
    { id: '12', name: 'Tallarín Saltado de Pollo', price: 15, category: 'Menús S/15', available: true, description: 'Menú premium del día', isVariable: true },
    
    // CARTA (Platos Fijos - Siempre disponibles)
    { id: '13', name: 'Ceviche Clásico', price: 18, category: 'Carta', available: true, description: 'Pescado fresco marinado en limón con cebolla, ají limo y camote', isVariable: false },
    { id: '14', name: 'Ceviche Mixto', price: 25, category: 'Carta', available: true, description: 'Pescado, camarones, pulpo y calamar en leche de tigre', isVariable: false },
    { id: '15', name: 'Tiradito de Pescado', price: 22, category: 'Carta', available: true, description: 'Finas láminas de pescado con crema de ají amarillo', isVariable: false },
    { id: '16', name: 'Arroz con Mariscos', price: 32, category: 'Carta', available: true, description: 'Arroz amarillo con mariscos frescos y culantro', isVariable: false },
    { id: '17', name: 'Jalea Mixta', price: 35, category: 'Carta', available: true, description: 'Mariscos y pescado apanado con yuca frita y salsa criolla', isVariable: false },
    { id: '18', name: 'Chupe de Camarones', price: 38, category: 'Carta', available: true, description: 'Sopa cremosa de camarones con huevo y queso', isVariable: false },
    
    // MARINOS (Platos Fijos - Especialidad en mariscos)
    { id: '19', name: 'Sudado de Pescado', price: 28, category: 'Marinos', available: true, description: 'Pescado cocido al vapor con yuca y salsa criolla', isVariable: false },
    { id: '20', name: 'Pescado a la Plancha', price: 26, category: 'Marinos', available: true, description: 'Filete de pescado con ensalada y papas doradas', isVariable: false },
    { id: '21', name: 'Chicharrón de Pescado', price: 24, category: 'Marinos', available: true, description: 'Pescado frito crujiente con yuca y salsa criolla', isVariable: false },
    { id: '22', name: 'Parihuela', price: 35, category: 'Marinos', available: true, description: 'Sopa concentrada de mariscos y pescado', isVariable: false },
    { id: '23', name: 'Arroz con Mariscos Personal', price: 20, category: 'Marinos', available: true, description: 'Porción personal de arroz con mariscos', isVariable: false },
    
    // LIGHT (Platos Fijos - Opciones saludables)
    { id: '24', name: 'Ensalada de Pollo', price: 18, category: 'Light', available: true, description: 'Ensalada fresca con pollo a la plancha', isVariable: false },
    { id: '25', name: 'Pescado al Vapor', price: 22, category: 'Light', available: true, description: 'Pescado al vapor con verduras', isVariable: false },
    { id: '26', name: 'Pollo Grillado', price: 20, category: 'Light', available: true, description: 'Pechuga de pollo con ensalada', isVariable: false },
    { id: '27', name: 'Ceviche Light', price: 16, category: 'Light', available: true, description: 'Ceviche con menos sal y sin camote', isVariable: false },
    
    // COMBOS PROMOCIÓN (Platos Fijos - Ofertas especiales)
    { id: '28', name: 'Combo Familiar Ceviche', price: 45, category: 'Combos', available: true, description: 'Ceviche grande + 2 gaseosas + yuca frita', isVariable: false },
    { id: '29', name: 'Combo Pareja', price: 35, category: 'Combos', available: true, description: '2 platos del día + 2 bebidas', isVariable: false },
    { id: '30', name: 'Combo Marino', price: 55, category: 'Combos', available: true, description: 'Jalea + Ceviche + 2 cervezas', isVariable: false },
    
    // BEBIDAS (Fijas)
    { id: '31', name: 'Chicha Morada', price: 8, category: 'Bebidas', available: true, description: 'Bebida tradicional de maíz morado', isVariable: false },
    { id: '32', name: 'Inca Kola', price: 6, category: 'Bebidas', available: true, description: 'Gaseosa nacional del Perú', isVariable: false },
    { id: '33', name: 'Jugo de Maracuyá', price: 10, category: 'Bebidas', available: true, description: 'Jugo natural de maracuyá', isVariable: false },
    { id: '34', name: 'Pisco Sour', price: 15, category: 'Bebidas', available: true, description: 'Cóctel tradicional peruano', isVariable: false },
    { id: '35', name: 'Cerveza Pilsen', price: 8, category: 'Bebidas', available: true, description: 'Cerveza nacional bien fría', isVariable: false }
  ],

  analytics: {
    todayRevenue: 1250,
    todayOrders: 42,
    monthlyOrders: 1260,
    averageTicket: 28,
    onlinePercentage: 45,
    topProducts: [
      { name: 'Ceviche Clásico', sales: 85 },
      { name: 'Arroz con Mariscos', sales: 62 },
      { name: 'Lomo Saltado', sales: 48 }
    ]
  }
};

// Función para simular llamadas a la base de datos
export const mockSupabaseCall = <T>(data: T, delay = 500): Promise<{ data: T; error: null }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, error: null });
    }, delay);
  });
};