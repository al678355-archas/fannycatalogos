import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../ui/Spinner.jsx';

/** Protege todas las rutas /admin excepto /admin/login */
export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <PageLoader label="Verificando sesión…" />;
  if (status !== 'authenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
