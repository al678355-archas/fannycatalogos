import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Vuelve al inicio de la página al navegar (salvo enlaces con #ancla) */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
