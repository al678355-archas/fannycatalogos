import { useCallback, useEffect, useState } from 'react';

/**
 * Ejecuta una función asíncrona (estable: definida fuera del componente o con useCallback)
 * y expone { data, error, loading, reload, setData }.
 */
export function useAsync(fn) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    fn().then(
      (data) => active && setState({ data, error: null, loading: false }),
      (error) => active && setState((s) => ({ data: s.data, error, loading: false })),
    );
    return () => {
      active = false;
    };
  }, [fn, nonce]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setNonce((n) => n + 1);
  }, []);

  const setData = useCallback(
    (updater) =>
      setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })),
    [],
  );

  return { ...state, reload, setData };
}
