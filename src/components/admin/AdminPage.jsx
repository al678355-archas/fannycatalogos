import { PageLoader } from '../ui/Spinner.jsx';
import { ErrorState } from '../ui/StateMessage.jsx';
import Button from '../ui/Button.jsx';

/** Encabezado de página del panel */
export function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__desc">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}

/** Tarjeta/panel con título */
export function Panel({ title, description, children, actions, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <div className="panel__head">
          <div>
            {title && <h2 className="panel__title">{title}</h2>}
            {description && <p className="panel__desc">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="panel__body">{children}</div>
    </section>
  );
}

/** Maneja estados loading / error de una página del panel */
export function AdminAsync({ loading, error, onRetry, children }) {
  if (loading) return <PageLoader />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  return children();
}

/** Barra fija de guardado para formularios con cambios pendientes */
export function SaveBar({ dirty, saving, onSave, onReset }) {
  return (
    <div className={`save-bar ${dirty ? 'is-dirty' : ''}`}>
      <span className="save-bar__status">
        {saving ? 'Guardando…' : dirty ? 'Tienes cambios sin guardar' : 'Todo está guardado'}
      </span>
      <div className="save-bar__actions">
        {dirty && (
          <Button variant="ghost" onClick={onReset} disabled={saving}>
            Descartar
          </Button>
        )}
        <Button onClick={onSave} loading={saving} disabled={!dirty}>
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
