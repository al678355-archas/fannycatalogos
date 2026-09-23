import { useCallback, useState } from 'react';
import { useAsync } from './useAsync.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Formularios de configuración (Header, Footer, Ajustes, Apariencia).
 * - load(): Promise<respuesta>, pick(respuesta) => objeto editable
 * - save(valores): Promise<respuesta>
 * El borrador sólo existe mientras hay cambios sin guardar (dirty).
 */
export function useEditableForm({ load, pick, save, successMessage = 'Guardado correctamente' }) {
  const resource = useAsync(load);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const saved = resource.data ? pick(resource.data) : null;
  const values = draft ?? saved;

  const set = useCallback(
    (patch) => setDraft((d) => ({ ...(d ?? saved), ...(typeof patch === 'function' ? patch(d ?? saved) : patch) })),
    [saved],
  );

  const reset = useCallback(() => {
    setDraft(null);
    setErrors({});
  }, []);

  const submit = useCallback(
    async (payload = values) => {
      setSaving(true);
      setErrors({});
      try {
        const response = await save(payload);
        resource.setData(response);
        setDraft(null);
        toast.success(successMessage);
        return response;
      } catch (err) {
        const fieldErrors = Object.fromEntries((err.details || []).map((d) => [d.field, d.message]));
        setErrors(fieldErrors);
        toast.error(`Error al guardar: ${err.message}`);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [values, save, resource, toast, successMessage],
  );

  return {
    values,
    data: resource.data,
    set,
    reset,
    submit,
    saving,
    errors,
    dirty: draft !== null,
    loading: resource.loading && !resource.data,
    error: resource.error,
    reload: resource.reload,
    setData: resource.setData,
  };
}
