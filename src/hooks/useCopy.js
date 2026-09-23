import { useCallback, useEffect, useRef, useState } from 'react';

/** Copia texto al portapapeles y expone un indicador temporal "copiado" */
export function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Alternativa para contextos sin Clipboard API (http, navegadores antiguos)
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
      return true;
    },
    [timeout],
  );

  return { copied, copy };
}
