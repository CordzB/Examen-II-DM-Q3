import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProductos, crearProducto, eliminarProducto } from '../api/api';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await getProductos();
      setProductos(data);
    } finally { setCargando(false); }
  }, []);

  const agregar = useCallback(async (p) => {
    const nuevo = await crearProducto(p);
    setProductos(prev => [nuevo, ...prev]);
  }, []);

  const eliminar = useCallback(async (id) => {
    await eliminarProducto(id);
    setProductos(prev => prev.filter(x => x.id !== id));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <ProductsContext.Provider value={{ productos, cargando, cargar, agregar, eliminar }}>
      {children}
    </ProductsContext.Provider>
  );
}
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
}
