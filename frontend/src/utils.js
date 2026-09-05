// Funciones chiquitas que se repiten en varias pantallas.
// El formateo de montos en la moneda elegida vive en
// contexto/ConfiguracionContext.jsx (useConfiguracion().formatearMonto),
// no acá, porque depende de la configuración que carga el admin.

export function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
