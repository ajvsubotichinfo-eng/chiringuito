// Placeholder para pantallas que todavía no se programaron (se
// reemplaza pantalla por pantalla en las próximas fases, cada una
// con su propia maqueta aprobada antes de programarla).
export default function PantallaProximamente({ titulo }) {
  return (
    <div className="pantalla-proximamente">
      <span className="etiqueta">{titulo}</span>
      <p>Próximamente</p>
    </div>
  );
}
