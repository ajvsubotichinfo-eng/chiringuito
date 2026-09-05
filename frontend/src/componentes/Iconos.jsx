// ============================================================
// Íconos de la app, dibujados como SVG de línea (no emojis) para que
// se vean iguales en cualquier celular o computadora y tomen el
// color del texto donde se usan.
// ============================================================

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
};

export function IconoBuscar(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconoProductos(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}

export function IconoProveedores(props) {
  return (
    <svg {...base} {...props}>
      <path d="M1 7h13v9H1z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function IconoPagos(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="6" width="20" height="13" rx="3" />
      <path d="M2 10h20" />
      <circle cx="17" cy="15" r="1.5" />
    </svg>
  );
}

export function IconoTilde(props) {
  return (
    <svg {...base} strokeWidth={3} {...props}>
      <path d="M5 12l4 4L19 7" />
    </svg>
  );
}

export function IconoUsuario(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function IconoCerrar(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconoSalir(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 4v16" />
    </svg>
  );
}
