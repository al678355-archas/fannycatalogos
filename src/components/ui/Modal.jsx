import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

/** Modal accesible reutilizable (Esc para cerrar, bloquea scroll, foco inicial) */
export default function Modal({ open, onClose, title, children, footer, size = 'md', dismissible = true }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible) onCloseRef.current?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    const focusable = dialogRef.current?.querySelector('input, textarea, select, button:not(.modal__close)');
    (focusable || dialogRef.current)?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      previous?.focus?.();
    };
  }, [open, dismissible]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && dismissible && onClose?.()}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        {(title || dismissible) && (
          <div className="modal__header">
            {title && (
              <h2 id={titleId} className="modal__title">
                {title}
              </h2>
            )}
            {dismissible && (
              <button className="modal__close" onClick={onClose} aria-label="Cerrar">
                ×
              </button>
            )}
          </div>
        )}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
