import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import { PageLoader } from './components/ui/Spinner.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import NotFound from './pages/NotFound.jsx';

// El panel se carga bajo demanda: los visitantes nunca descargan su código
const AdminApp = lazy(() => import('./AdminApp.jsx'));

function PublicSite() {
  return (
    <SiteProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </ErrorBoundary>
  );
}
