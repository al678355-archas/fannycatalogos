import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import LoadingNails from './components/ui/LoadingNails.jsx';
import { useKeepAlive } from './hooks/useKeepAlive.js';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

const AdminApp = lazy(() => import('./AdminApp.jsx'));

function PublicSite() {
  return (
    <SiteProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}

export default function App() {
  // Ping silencioso al backend cada 15 minutos (sitio público y panel)
  useKeepAlive();

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<LoadingNails variant="page" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </ErrorBoundary>
  );
}
