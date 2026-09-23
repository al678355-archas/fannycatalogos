import { useEffect } from 'react';
import Button from '../components/ui/Button.jsx';

export default function NotFound({ homeTo = '/', homeLabel = 'Volver al inicio' }) {
  useEffect(() => {
    document.title = 'Página no encontrada';
  }, []);

  return (
    <div className="container page-pad">
      <div className="state state--page">
        <p className="notfound__code">404</p>
        <h1 className="state__title">Página no encontrada</h1>
        <p className="state__msg">La página que buscas no existe o fue movida.</p>
        <Button to={homeTo}>{homeLabel}</Button>
      </div>
    </div>
  );
}
