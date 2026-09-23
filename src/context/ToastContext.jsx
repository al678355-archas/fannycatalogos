import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);
const DURATION = 3800;

/** Notificaciones breves de feedback: "Guardado correctamente", "Error al guardar"... */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (type, message) => {
      const id = ++counter.current;
      setToasts((list) => [...list.slice(-3), { id, type, message }]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (msg) => push('success', msg),
      error: (msg) => push('error', msg),
      info: (msg) => push('info', msg),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span className="toast__icon" aria-hidden="true">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : 'i'}
            </span>
            <span className="toast__msg">{t.message}</span>
            <button className="toast__close" onClick={() => dismiss(t.id)} aria-label="Cerrar">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}
