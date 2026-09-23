import Button from './Button.jsx';

/** Estado vacío: sin resultados, sin productos, etc. */
export function EmptyState({ icon = '✦', title, message, action }) {
  return (
    <div className="state state--empty">
      <div className="state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="state__title">{title}</h3>
      {message && <p className="state__msg">{message}</p>}
      {action}
    </div>
  );
}

/** Estado de error con opción de reintentar */
export function ErrorState({ title = 'Algo salió mal', error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true">
        !
      </div>
      <h3 className="state__title">{title}</h3>
      <p className="state__msg">{error?.message || 'No se pudo cargar la información.'}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
