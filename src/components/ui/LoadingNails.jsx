import { useId } from 'react';
import '../../styles/loading-nails.css';

/**
 * Indicador de carga temático: una uña pintándose con esmalte.
 * SVG + animaciones CSS, sin imágenes externas. Toma los colores del tema.
 *
 * variant:
 *  - "page"    ocupa la pantalla y queda centrado (carga inicial, rutas)
 *  - "section" ocupa sólo el espacio necesario dentro de una sección o panel
 *  - "inline"  tamaño de texto, para botones
 *
 * Accesible: anuncia `label` a lectores de pantalla sin mostrar texto.
 */
export default function LoadingNails({ variant = 'section', label = 'Cargando contenido', className = '' }) {
  // id único por instancia (puede haber varios indicadores en pantalla a la vez)
  const clipId = `ln-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <span
      className={`loading-nails loading-nails--${variant} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg className="ln-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <path d="M24 34V24a8 8 0 0 1 16 0v10q-8 3-16 0Z" />
          </clipPath>
        </defs>

        {/* Dedo */}
        <path className="ln-finger" d="M20 66V26a12 12 0 0 1 24 0v40" />

        {/* Uña: base y tres pinceladas de esmalte (centro, izquierda, derecha) */}
        <path className="ln-nail" d="M24 34V24a8 8 0 0 1 16 0v10q-8 3-16 0Z" />
        <g clipPath={`url(#${clipId})`}>
          <rect className="ln-stroke ln-stroke--center" x="28.5" y="14" width="7" height="23" />
          <rect className="ln-stroke ln-stroke--left" x="23" y="14" width="6.5" height="23" />
          <rect className="ln-stroke ln-stroke--right" x="34.5" y="14" width="6.5" height="23" />
        </g>

        {/* Brillo al terminar */}
        <path className="ln-shine" d="M27.2 29.5v-5.2a4.8 4.8 0 0 1 2.6-4.3" />
        <path className="ln-sparkle" d="M47 13l1.1 2.9L51 17l-2.9 1.1L47 21l-1.1-2.9L43 17l2.9-1.1Z" />

        {/* Pincel del esmalte (la punta está en el origen del grupo) */}
        <g className="ln-brush">
          <path className="ln-brush__bristles" d="M0 0-1.8-6.4h3.6Z" />
          <rect className="ln-brush__ferrule" x="-2.1" y="-9.6" width="4.2" height="3.4" rx=".7" />
          <rect className="ln-brush__handle" x="-2.5" y="-27" width="5" height="17.6" rx="2.5" />
        </g>
      </svg>
    </span>
  );
}
