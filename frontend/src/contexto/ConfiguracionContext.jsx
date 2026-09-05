// ============================================================
// Contexto de configuración de la app: por ahora, solo la moneda
// (elegida por el admin en /configuracion). Expone formatearMonto()
// para que cualquier pantalla muestre los montos en la moneda
// correcta, sin tener que leer la configuración una por una.
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api';

const ConfiguracionContext = createContext(null);

export function ConfiguracionProvider({ children }) {
  const [moneda, setMoneda] = useState('ARS');

  useEffect(() => {
    apiFetch('/api/configuracion').then(respuesta => {
      if (respuesta.ok) setMoneda(respuesta.configuracion.moneda || 'ARS');
    });
  }, []);

  const formatearMonto = useCallback(
    (valor) => new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda,
      maximumFractionDigits: 0
    }).format(valor),
    [moneda]
  );

  return (
    <ConfiguracionContext.Provider value={{ moneda, setMoneda, formatearMonto }}>
      {children}
    </ConfiguracionContext.Provider>
  );
}

export function useConfiguracion() {
  return useContext(ConfiguracionContext);
}
