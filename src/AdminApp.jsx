import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminContent from './pages/admin/AdminContent.jsx';
import AdminHeader from './pages/admin/AdminHeader.jsx';
import AdminFooter from './pages/admin/AdminFooter.jsx';
import AdminAppearance from './pages/admin/AdminAppearance.jsx';
import AdminImages from './pages/admin/AdminImages.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';
import AdminAdmins from './pages/admin/AdminAdmins.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import NotFound from './pages/NotFound.jsx';
import './styles/admin.css';

export default function AdminApp() {
  // La paleta del panel se aplica al body para que modales y avisos también la usen
  useEffect(() => {
    document.body.classList.add('admin-body');
    return () => document.body.classList.remove('admin-body');
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="header" element={<AdminHeader />} />
            <Route path="footer" element={<AdminFooter />} />
            <Route path="appearance" element={<AdminAppearance />} />
            <Route path="images" element={<AdminImages />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="admins" element={<AdminAdmins />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound homeTo="/admin" homeLabel="Volver al panel" />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
